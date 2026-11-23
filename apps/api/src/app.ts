import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

export interface AppOptions {
  webOrigin: string
  verifyDatabase: () => Promise<void>
}

export function createApp({ webOrigin, verifyDatabase }: AppOptions) {
  const app = express()
  const api = express.Router()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({ origin: webOrigin, credentials: true }))
  app.use(express.json({ limit: '32kb' }))
  app.use('/api/v1', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' },
    },
  }))

  api.get('/health/live', (_request, response) => {
    response.status(200).json({ status: 'ok' })
  })

  api.get('/health/ready', async (_request, response) => {
    try {
      await verifyDatabase()
      response.status(200).json({ status: 'ready', checks: { database: 'ok' } })
    } catch {
      response.status(503).json({ status: 'not_ready', checks: { database: 'unavailable' } })
    }
  })

  app.use('/api/v1', api)
  app.use((_request, response) => {
    response.status(404).json({
      error: { code: 'NOT_FOUND', message: 'The requested API route was not found.' },
    })
  })

  const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    if (response.headersSent) {
      next(error)
      return
    }

    if (error instanceof SyntaxError && 'body' in error) {
      response.status(400).json({
        error: { code: 'INVALID_JSON', message: 'Request body must contain valid JSON.' },
      })
      return
    }

    if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.too.large') {
      response.status(413).json({
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body exceeds the allowed size.' },
      })
      return
    }

    console.error('Unhandled API error', { method: request.method, path: request.path })
    response.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
    })
  }
  app.use(errorHandler)

  return app
}
