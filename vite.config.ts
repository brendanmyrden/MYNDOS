import { readFile, stat } from 'node:fs/promises'
import { normalize, relative } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const SOURCE_EXTENSIONS = /\.(css|jsx?|tsx?)$/

function waitForStableSource(): Plugin {
  return {
    name: "myndos:wait-for-stable-source",
    apply: "serve",
    enforce: "pre",
    async transform(code, id) {
      const [filePath] = id.split("?")
      if (
        !filePath ||
        filePath.includes("/node_modules/") ||
        !SOURCE_EXTENSIONS.test(filePath)
      ) {
        return null
      }

      const relativePath = normalize(relative(process.cwd(), filePath))
      if (relativePath.startsWith("..")) {
        return null
      }

      try {
        const before = await stat(filePath)
        await new Promise((resolve) => setTimeout(resolve, 300))
        const after = await stat(filePath)

        if (before.size !== after.size || before.mtimeMs !== after.mtimeMs) {
          await new Promise((resolve) => setTimeout(resolve, 700))
        }

        const stableCode = await readFile(filePath, "utf8")
        if (stableCode !== code) {
          return {
            code: stableCode,
            map: null,
          }
        }
      } catch {
        return null
      }

      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [waitForStableSource(), react()],
  cacheDir: "node_modules/.vite-myndos",
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false,
    },
    watch: {
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
      ignored: [
        "**/package.json",
        "**/package-lock.json",
        "**/tsconfig*.json",
      ],
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
      "react/jsx-runtime",
      "react-router-dom",
    ],
  },
})
