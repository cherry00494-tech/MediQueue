import assert from 'node:assert/strict'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { test } from 'node:test'
import { createApp } from '../src/app.js'

async function requestHealth(
  path: string,
  verifyDatabase: () => Promise<void>,
): Promise<Response> {
  const app = createApp({ webOrigin: 'http://localhost:5173', verifyDatabase })
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address() as AddressInfo

  try {
    return await fetch(`http://127.0.0.1:${address.port}${path}`)
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
}

test('liveness does not depend on database availability', async () => {
  const response = await requestHealth('/api/v1/health/live', async () => {
    throw new Error('database unavailable')
  })

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

test('readiness reports database failure without exposing details', async () => {
  const response = await requestHealth('/api/v1/health/ready', async () => {
    throw new Error('sensitive database connection detail')
  })

  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), {
    status: 'not_ready',
    checks: { database: 'unavailable' },
  })
})

test('unknown API routes return a stable not-found response', async () => {
  const response = await requestHealth('/api/v1/not-a-route', async () => {})

  assert.equal(response.status, 404)
  assert.deepEqual(await response.json(), {
    error: { code: 'NOT_FOUND', message: 'The requested API route was not found.' },
  })
})
