import { createApp } from './app.js'
import { loadEnvironment } from './config/env.js'
import { prisma } from './database/prisma.js'

const environment = loadEnvironment()
const app = createApp({
  webOrigin: environment.WEB_ORIGIN,
  verifyDatabase: async () => {
    await prisma.$queryRaw`SELECT 1`
  },
})

const server = app.listen(environment.PORT, () => {
  console.info(`MediQueue API listening on port ${environment.PORT}`)
})

function shutdown(signal: NodeJS.Signals) {
  console.info(`Received ${signal}; shutting down API.`)
  server.close(() => {
    void prisma.$disconnect().then(
      () => process.exit(0),
      () => {
        console.error('Database client shutdown failed.')
        process.exit(1)
      },
    )
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
