// Builds one PDF from the documentation chapters (docs chapter 6.2, "PDF dokumentacije").
// Usage (from scripts/docs-pdf): npm install, then npm run build -- v1
// Output: docs/deliverables/PROINZ26_G09.4_ChartIt_<version>.pdf
// Uses the locally installed Chrome; set CHROME_PATH if it is not in the default location.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Marked } from 'marked'
import GithubSlugger from 'github-slugger'
import puppeteer from 'puppeteer-core'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const version = process.argv[2] || 'v1'
const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../..')
const docs = path.join(repo, 'docs')
const outPdf = path.join(docs, 'deliverables', `PROINZ26_G09.4_ChartIt_${version}.pdf`)

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
]
const chrome = CHROME_CANDIDATES.find((p) => p && fs.existsSync(p))
if (!chrome) {
  console.error('Chrome nije pronađen. Postavite CHROME_PATH na putanju do Chromea.')
  process.exit(1)
}
// Links to files outside the PDF point to the commit the PDF is built from, not to main, so they
// keep showing what was submitted. Build from a commit that is pushed (or will be merged).
const rev = execSync('git rev-parse HEAD', { cwd: repo }).toString().trim()
const GH = `https://github.com/tmpteamname1/ChartIt/blob/${rev}/`
// Diagrams too wide for a portrait page get their own landscape page, together with the caption.
const WIDE_IMAGES = ['story-map', '4-1-chartit-system-CMP', '4-3-chartit-domain-CD']
const FILES = [
  'Home.md',
  '1-Projekt.md',
  '2-Analiza-zahtjeva.md',
  '3-Obrasci-uporabe.md',
  '4-Arhitektura-i-oblikovanje.md',
  '5-Ispitivanje.md',
  '6-Postavljanje-instalacija-i-konfiguracija.md',
  '7-Zakljucak-i-buduci-rad.md',
  'A-Pregled-aktivnosti-grupe.md',
]
const key = (f) => 'f-' + f.replace(/\.md$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
const toc = []

function rewriteHref(href, file) {
  if (!href || /^(https?:|mailto:)/.test(href)) return href
  const [p, hash] = href.split('#')
  if (!p) return '#' + key(file) + '--' + hash
  // path.posix, so links keep forward slashes when the PDF is built on Windows.
  const resolved = path.posix.normalize(path.posix.join('docs', p)) // repo-relative
  const base = path.posix.basename(resolved)
  if (FILES.includes(base) && path.posix.dirname(resolved) === 'docs') {
    return '#' + key(base) + (hash ? '--' + hash : '')
  }
  return GH + resolved + (hash ? '#' + hash : '')
}

function render(file) {
  const slugger = new GithubSlugger()
  const md = fs.readFileSync(path.join(docs, file), 'utf8')
  const marked = new Marked({ gfm: true })
  marked.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const id = key(file) + '--' + slugger.slug(text)
        if (depth <= 2) toc.push({ depth, text: text.replace(/[`*]/g, ''), id })
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`
      },
      link({ href, title, tokens }) {
        return `<a href="${rewriteHref(href, file)}"${title ? ` title="${title}"` : ''}>${this.parser.parseInline(tokens)}</a>`
      },
      image({ href, text }) {
        const src = /^https?:/.test(href) ? href : pathToFileURL(path.join(docs, href)).href
        const wide = WIDE_IMAGES.some((name) => href.includes(name))
        return `<img src="${src}" alt="${text}"${wide ? ' class="wide"' : ''}>`
      },
      // Mermaid diagrams are rendered to SVG in the browser before printing.
      code({ text, lang }) {
        if (lang !== 'mermaid') return false
        const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return `<div class="mermaid">${escaped}</div>\n`
      },
    },
  })
  let html = marked.parse(md)
  html = html
    .replace(/<a id="([^"]+)"><\/a>/g, (_, id) => `<a id="${key(file)}--${id}"></a>`)
    .replace(/<details>/g, '<details open>')
    // A paragraph with a wide image, plus a caption paragraph right after it, moves to a landscape page.
    .replace(
      /<p>((?:(?!<\/p>)[\s\S])*?class="wide"(?:(?!<\/p>)[\s\S])*)<\/p>\s*(<p><strong>Slika(?:(?!<\/p>)[\s\S])*<\/p>)?/g,
      (_, figure, caption) => `<div class="landscape"><p>${figure}</p>${caption || ''}</div>`,
    )
    // Short cells (IDs such as F-01, dates, roles) stay on one line.
    .replace(/<(td|th)([^>]*)>([\s\S]*?)<\/\1>/g, (cell, tag, attrs, inner) => {
      const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, 'x').trim()
      if (text.length <= 14) return `<${tag}${attrs} class="nw">${inner}</${tag}>`
      // Long identifiers in code may break only after _ . / : so the parts stay readable.
      const withBreaks = inner.replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => `<code>${c.replace(/([_./:])/g, '$1<wbr>')}</code>`)
      return `<${tag}${attrs}>${withBreaks}</${tag}>`
    })
  return `<section class="chapter" id="${key(file)}">${html}</section>`
}

const chapters = FILES.map(render)
// Page numbers are known only after printing: the first pass prints with placeholders of the same
// width, the page of each heading is read from the PDF outline, and the second pass prints again.
const tocHtml = (pages) =>
  toc
    .map((t, i) => `<li class="d${t.depth}"><a href="#${t.id}"><span class="t">${t.text}</span><span class="pg">${pages[i] ?? ''}</span></a></li>`)
    .join('\n')
const today = new Date().toLocaleDateString('hr-HR')

const page = (pages) => `<!doctype html><html lang="hr"><head><meta charset="utf-8"><title>ChartIt – projektna dokumentacija</title>
<style>
  @page { size: A4; margin: 18mm 15mm 18mm 15mm; }
  @page wide { size: A4 landscape; margin: 12mm; }
  .landscape { page: wide; display: block; break-before: page; break-after: page; }
  .landscape p { margin: 0 0 4px; }
  .landscape img { max-height: 168mm; width: 100%; object-fit: contain; margin: 0 auto; }
  p:has(> img) { break-inside: avoid; }
  .mermaid { break-inside: avoid; margin: 8px 0; text-align: center; }
  .mermaid svg { width: 100%; max-width: 100% !important; height: auto; max-height: 230mm; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; font-size: 10pt; line-height: 1.45; color: #1f2328; }
  h1 { font-size: 20pt; border-bottom: 2px solid #0d6efd; padding-bottom: 4px; margin-top: 0; }
  h2 { font-size: 14pt; margin-top: 20px; border-bottom: 1px solid #d0d7de; padding-bottom: 2px; }
  h3 { font-size: 12pt; margin-top: 16px; } h4 { font-size: 10.5pt; }
  h1, h2, h3, h4 { break-after: avoid; }
  .chapter { break-before: page; }
  table { border-collapse: collapse; width: 100%; font-size: 8pt; margin: 8px 0; table-layout: auto; }
  /* break-word keeps whole words together, so columns do not shrink below their longest word */
  th, td { border: 1px solid #d0d7de; padding: 3px 5px; vertical-align: top; overflow-wrap: break-word; }
  td.nw, th.nw { white-space: nowrap; }
  td code { overflow-wrap: break-word; font-size: 7.5pt; }
  th { background: #f0f3f6; } tr { break-inside: avoid; }
  code { font-family: Menlo, monospace; font-size: 8.5pt; background: #f0f3f6; padding: 0 2px; border-radius: 3px; }
  pre { background: #f6f8fa; padding: 8px; border-radius: 4px; white-space: pre-wrap; font-size: 8pt; break-inside: avoid; }
  pre code { background: none; padding: 0; }
  img { max-width: 100%; max-height: 200mm; display: block; margin: 8px auto; }
  blockquote { border-left: 3px solid #d0d7de; margin: 8px 0; padding: 0 10px; color: #57606a; }
  details { margin: 6px 0; } summary { font-weight: 600; list-style: none; }
  a { color: #0969da; text-decoration: none; }
  .cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; text-align: center; }
  .cover h1 { border: none; font-size: 30pt; margin-bottom: 4px; }
  .cover .sub { font-size: 14pt; color: #57606a; margin-bottom: 30px; }
  .cover p { margin: 3px 0; font-size: 11pt; }
  .toc { break-before: page; } .toc ul { list-style: none; padding: 0; }
  .toc li.d1 { font-weight: 600; margin-top: 8px; } .toc li.d2 { margin-left: 16px; font-size: 9.5pt; }
  .toc a { display: flex; align-items: baseline; color: inherit; }
  .toc a .t { flex: 0 1 auto; } .toc a .pg { flex: 0 0 auto; margin-left: auto; padding-left: 6px; font-variant-numeric: tabular-nums; }
  .toc a::after { content: ""; order: 1; flex: 1 1 auto; border-bottom: 1px dotted #8c959f; margin: 0 4px; min-width: 8mm; }
  .toc a .pg { order: 2; margin-left: 0; min-width: 7mm; text-align: right; }
</style></head><body>
<div class="cover">
  <h1>ChartIt</h1>
  <div class="sub">Projektna dokumentacija – ${version === 'v1' ? 'Iteracija 1' : version}</div>
  <p>Programsko inženjerstvo, Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu</p>
  <p>Akademska godina 2026./2027.</p>
  <p>Tim G09.4 ChartIt</p>
  <p style="margin-top:24px">Repozitorij: https://github.com/tmpteamname1/ChartIt</p>
  <p>Javna aplikacija: https://chartit-okv1.onrender.com</p>
  <p style="margin-top:24px">Datum: ${today}</p>
</div>
<nav class="toc"><h1>Sadržaj</h1><ul>${tocHtml(pages)}</ul></nav>
${chapters.join('\n')}
<script src="${pathToFileURL(path.join(here, 'node_modules/mermaid/dist/mermaid.min.js')).href}"></script>
<script>mermaid.initialize({ startOnLoad: false, theme: 'neutral', flowchart: { htmlLabels: false } })</script>
</body></html>`

// The intermediate HTML goes to a temp folder; images are referenced from docs/ by absolute file URL.
const htmlPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'chartit-docs-')), 'docs.html')
fs.mkdirSync(path.dirname(outPdf), { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  args: ['--allow-file-access-from-files'],
})
const tab = await browser.newPage()

async function print(pages) {
  fs.writeFileSync(htmlPath, page(pages))
  await tab.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
  await tab.evaluate(() => window.mermaid.run({ querySelector: '.mermaid' }))
  return tab.pdf({
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="font-size:8px;width:100%;text-align:center;color:#57606a">ChartIt – projektna dokumentacija · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    outline: true,
    tagged: true,
  })
}

// Page number (1-based) of every heading in the PDF outline, in document order.
async function headingPages(pdfBytes) {
  const pdf = await getDocument({ data: new Uint8Array(pdfBytes), verbosity: 0 }).promise
  const result = []
  async function walk(items) {
    for (const item of items || []) {
      const dest = typeof item.dest === 'string' ? await pdf.getDestination(item.dest) : item.dest
      const page = dest ? (await pdf.getPageIndex(dest[0])) + 1 : null
      result.push({ title: item.title.replace(/\s+/g, ' ').trim(), page })
      await walk(item.items)
    }
  }
  await walk(await pdf.getOutline())
  return result
}

const draft = await print(toc.map(() => '000'))
const outline = await headingPages(draft)
// Match TOC entries to outline entries in order, by title.
let from = 0
const pages = toc.map((t) => {
  const title = t.text.replace(/\s+/g, ' ').trim()
  const i = outline.findIndex((o, j) => j >= from && o.title === title)
  if (i === -1) return ''
  from = i + 1
  return String(outline[i].page)
})
const missing = toc.filter((_, i) => !pages[i]).map((t) => t.text)
if (missing.length) console.warn('Bez broja stranice u sadržaju:', missing.join('; '))

fs.writeFileSync(outPdf, await print(pages))
await browser.close()
console.log('PDF:', outPdf)
