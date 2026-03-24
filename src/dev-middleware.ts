/**
 * src/dev-middleware.ts
 *
 * Dev server middleware API + proxy support.
 * Wire this into your existing Express dev server.
 *
 * In your dev server setup (wherever you create the Express app):
 *   import { applyMiddleware, applyProxies } from './dev-middleware.js'
 *   applyMiddleware(app, config)
 *   applyProxies(app, config)
 */

import type { Express, Request, Response, NextFunction } from 'express'
import type { BuildConfig } from './config/index.js'
import http from 'http'
import https from 'https'
import { URL } from 'url'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>

// ─── User middleware ──────────────────────────────────────────────────────────

/**
 * Apply user-defined middleware from config.server.middleware (or dev.middleware).
 * These run BEFORE static file serving and HMR.
 *
 * @example
 * // nuclie.config.js
 * module.exports = {
 *   server: {
 *     middleware: [
 *       (req, res, next) => {
 *         res.setHeader('X-Custom-Header', 'nuclie')
 *         next()
 *       }
 *     ]
 *   }
 * }
 */
export function applyMiddleware(app: Express, config: BuildConfig): void {
  // Support both config.server.middleware and config.dev.middleware patterns
  const serverMiddlewares = (config.server as Record<string, unknown> | undefined)?.['middleware'] as
    | MiddlewareFn[]
    | undefined

  const middlewares = serverMiddlewares

  if (!middlewares || middlewares.length === 0) return

  for (const fn of middlewares) {
    if (typeof fn === 'function') {
      app.use((req, res, next) => {
        try {
          const result = fn(req, res, next)
          if (result instanceof Promise) {
            result.catch(next)
          }
        } catch (err) {
          next(err)
        }
      })
    }
  }
}

// ─── Proxy ────────────────────────────────────────────────────────────────────

interface ProxyTarget {
  target: string
  changeOrigin?: boolean
  rewrite?: (path: string) => string
  secure?: boolean
}

/**
 * Apply proxy rules from config.server.proxy.
 * Forwards matching requests to the target server.
 *
 * @example
 * // nuclie.config.js
 * module.exports = {
 *   server: {
 *     proxy: {
 *       '/api': {
 *         target: 'http://localhost:8080',
 *         changeOrigin: true,
 *         rewrite: (path) => path.replace(/^\/api/, '')
 *       }
 *     }
 *   }
 * }
 */
export function applyProxies(app: Express, config: BuildConfig): void {
  const proxy = config.server?.proxy
  if (!proxy || Object.keys(proxy).length === 0) return

  for (const [prefix, proxyConfig] of Object.entries(proxy)) {
    const target = proxyConfig as unknown as ProxyTarget

    app.use(prefix, (req: Request, res: Response) => {
      let targetPath = req.url ?? '/'

      // Apply path rewrite if configured
      if (target.rewrite) {
        targetPath = target.rewrite(prefix + targetPath)
      }

      proxyRequest(req, res, target.target, targetPath, target.changeOrigin ?? false)
    })

    console.log(`  [nuclie] Proxy: ${prefix} → ${target.target}`)
  }
}

function proxyRequest(
  req: Request,
  res: Response,
  targetBase: string,
  targetPath: string,
  changeOrigin: boolean
): void {
  let parsedTarget: URL
  try {
    parsedTarget = new URL(targetBase)
  } catch {
    res.status(502).send(`[nuclie proxy] Invalid target URL: ${targetBase}`)
    return
  }

  const isHttps = parsedTarget.protocol === 'https:'
  const transport = isHttps ? https : http

  const options: http.RequestOptions = {
    hostname: parsedTarget.hostname,
    port: parsedTarget.port || (isHttps ? 443 : 80),
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      // Fix host header
      host: changeOrigin ? parsedTarget.host : req.headers.host,
    },
  }

  const proxyReq = transport.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode ?? 200)
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      if (value !== undefined) {
        res.setHeader(key, value)
      }
    }
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (err) => {
    if (!res.headersSent) {
      res.status(502).json({
        error: '[nuclie proxy] Connection failed',
        target: targetBase,
        message: err.message,
      })
    }
  })

  if (req.body) {
    const body = typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body)
    proxyReq.write(body)
  }

  req.pipe(proxyReq)
}

// ─── CORS middleware (opt-in) ─────────────────────────────────────────────────

/**
 * Apply CORS headers for dev server.
 * Automatically enabled when federation.exposes is configured
 * (remote apps must serve remoteEntry.js with CORS headers).
 */
export function applyCORS(app: Express, config: BuildConfig): void {
  const hasExposes =
    config.federation?.exposes && Object.keys(config.federation.exposes).length > 0

  // Remote apps must serve remoteEntry.js with CORS headers
  if (hasExposes || config.server?.cors) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      if (req.method === 'OPTIONS') {
        res.status(204).end()
        return
      }
      next()
    })
    console.log('  [nuclie] CORS enabled (federation remote mode)')
  }
}

// ─── Request logger (dev only) ────────────────────────────────────────────────

export function applyRequestLogger(app: Express): void {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const skip = [
      '/__nuclie_hmr',
      '/favicon.ico',
      '/@nuclie',
    ]
    if (!skip.some(s => req.url?.startsWith(s))) {
      const method = req.method?.padEnd(4) ?? 'GET '
      console.log(`  \x1b[2m${method} ${req.url}\x1b[0m`)
    }
    next()
  })
}
