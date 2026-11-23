import 'dotenv/config'
import { z } from 'zod'

const EnvironmentSchema = z.object({
  DATABASE_URL: z.string().url().refine(
    (value) => value.startsWith('postgresql://') || value.startsWith('postgres://'),
    'must use a PostgreSQL connection URL',
  ),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
})

export type Environment = z.infer<typeof EnvironmentSchema>

export function loadEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
  const parsed = EnvironmentSchema.safeParse(source)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid environment configuration: ${issues}`)
  }
  return parsed.data
}
