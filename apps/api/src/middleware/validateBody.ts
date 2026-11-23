import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (request, response, next) => {
    const parsed = schema.safeParse(request.body)
    if (!parsed.success) {
      response.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Request body validation failed.',
          fields: parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            code: issue.code,
          })),
        },
      })
      return
    }

    request.body = parsed.data
    next()
  }
}
