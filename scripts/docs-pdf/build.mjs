// Builds one PDF from the documentation chapters (docs chapter 6.2, "PDF dokumentacije").
// Usage (from scripts/docs-pdf): npm install, then npm run build -- v1
// Output: docs/deliverables/PROINZ26_G09.4_ChartIt_<version>.pdf
// Uses the locally installed Chrome; set CHROME_PATH if it is not in the default location.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Marked } from 'marked'
import GithubSlugger from 'github-slugger'
import puppeteer from 'puppeteer-core'

const version = process.argv[2] || 'v1'
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
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
const GH = 'https://github.com/tmpteamname1/ChartIt/blob/main/'
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
  const resolved = path.normalize(path.join('docs', p)) // repo-relative
  const base = path.basename(resolved)
  if (resolved.startsWith('docs/') && FILES.includes(base) && path.dirname(resolved) === 'docs') {
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
        // Very wide images (the story map) get their own landscape page.
        if (href.includes('story-map')) {
          return `<span class="landscape"><img src="${src}" alt="${text}"></span>`
        }
        return `<img src="${src}" alt="${text}">`
      },
    },
  })
  let html = marked.parse(md)
  html = html
    .replace(/<a id="([^"]+)"><\/a>/g, (_, id) => `<a id="${key(file)}--${id}"></a>`)
    .replace(/<details>/g, '<details open>')
  return `<section class="chapter" id="${key(file)}">${html}</section>`
}

const chapters = FILES.map(render)
const tocHtml = toc
  .map((t) => `<li class="d${t.depth}"><a href="#${t.id}">${t.text}</a></li>`)
  .join('\n')
const today = new Date().toLocaleDateString('hr-HR')

const page = `<!doctype html><html lang="hr"><head><meta charset="utf-8"><title>ChartIt – projektna dokumentacija</title>
<style>
  @page { size: A4; margin: 18mm 15mm 18mm 15mm; }
  @page wide { size: A4 landscape; margin: 12mm; }
  .landscape { page: wide; display: block; break-before: page; break-after: page; }
  .landscape img { max-height: 170mm; width: 100%; object-fit: contain; margin: 0; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; font-size: 10pt; line-height: 1.45; color: #1f2328; }
  h1 { font-size: 20pt; border-bottom: 2px solid #0d6efd; padding-bottom: 4px; margin-top: 0; }
  h2 { font-size: 14pt; margin-top: 20px; border-bottom: 1px solid #d0d7de; padding-bottom: 2px; }
  h3 { font-size: 12pt; margin-top: 16px; } h4 { font-size: 10.5pt; }
  h1, h2, h3, h4 { break-after: avoid; }
  .chapter { break-before: page; }
  table { border-collapse: collapse; width: 100%; font-size: 8pt; margin: 8px 0; table-layout: auto; }
  th, td { border: 1px solid #d0d7de; padding: 3px 5px; vertical-align: top; overflow-wrap: anywhere; }
  th { background: #f0f3f6; } tr { break-inside: avoid; }
  code { font-family: Menlo, monospace; font-size: 8.5pt; background: #f0f3f6; padding: 0 2px; border-radius: 3px; overflow-wrap: anywhere; }
  pre { background: #f6f8fa; padding: 8px; border-radius: 4px; white-space: pre-wrap; font-size: 8pt; break-inside: avoid; }
  pre code { background: none; padding: 0; }
  img { max-width: 100%; max-height: 235mm; display: block; margin: 8px auto; }
  blockquote { border-left: 3px solid #d0d7de; margin: 8px 0; padding: 0 10px; color: #57606a; }
  details { margin: 6px 0; } summary { font-weight: 600; list-style: none; }
  a { color: #0969da; text-decoration: none; }
  .cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; text-align: center; }
  .cover h1 { border: none; font-size: 30pt; margin-bottom: 4px; }
  .cover .sub { font-size: 14pt; color: #57606a; margin-bottom: 30px; }
  .cover p { margin: 3px 0; font-size: 11pt; }
  .toc { break-before: page; } .toc ul { list-style: none; padding: 0; }
  .toc li.d1 { font-weight: 600; margin-top: 8px; } .toc li.d2 { margin-left: 16px; font-size: 9.5pt; }
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
<nav class="toc"><h1>Sadržaj</h1><ul>${tocHtml}</ul></nav>
${chapters.join('\n')}
</body></html>`

// The intermediate HTML goes to a temp folder; images are referenced from docs/ by absolute file URL.
const htmlPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'chartit-docs-')), 'docs.html')
fs.writeFileSync(htmlPath, page)
fs.mkdirSync(path.dirname(outPdf), { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  args: ['--allow-file-access-from-files'],
})
const tab = await browser.newPage()
await tab.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
await tab.pdf({
  path: outPdf,
  preferCSSPageSize: true,
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="font-size:8px;width:100%;text-align:center;color:#57606a">ChartIt – projektna dokumentacija · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  outline: true,
  tagged: true,
})
await browser.close()
console.log('PDF:', outPdf)
