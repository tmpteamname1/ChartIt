import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const djangoUrl = 'http://127.0.0.1:8000'

// Django must see Host: localhost:8000, because that is the redirect URI registered with Google
// (allauth builds redirect_uri from the Host header). 127.0.0.1 and localhost are different
// addresses for Google.
const googleLoginProxy = { target: djangoUrl, headers: { host: 'localhost:8000' } }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Read VITE_* variables from the shared .env in the repository root; Vite exposes only that prefix.
  envDir: '..',
  build: {
    // Django serves the build from here (see FRONTEND_DIST_DIR in backend/config/settings.py)
    outDir: '../backend/frontend_dist',
    emptyOutDir: true,
  },
  server: {
    // Forward Django routes so the dev server behaves like production (single origin)
    proxy: {
      '/api': googleLoginProxy,
      '/_allauth': googleLoginProxy,
      '/admin': djangoUrl,
      '/static': djangoUrl,
      '/media': djangoUrl,
    },
  },
})
