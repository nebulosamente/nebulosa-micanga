import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function shareOrigin() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (!host) return null
  return host.startsWith('http') ? host.replace(/\/$/, '') : `https://${host}`
}

function absoluteShareMeta(): Plugin {
  return {
    name: 'absolute-share-meta',
    transformIndexHtml(html) {
      const origin = shareOrigin()
      if (!origin) return html
      return html
        .replaceAll('content="/og.png"', `content="${origin}/og.png"`)
        .replace(
          '<meta property="og:type" content="website" />',
          `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${origin}/" />`,
        )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), absoluteShareMeta()],
  server: {
    host: '0.0.0.0',
    port: 4337,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4338,
    strictPort: true,
  },
})
