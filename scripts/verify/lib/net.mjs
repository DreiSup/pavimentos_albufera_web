// Spawns the app's own `next start` on a free port for the checks that need
// real HTTP semantics (redirect status codes, 404s) instead of static
// manifest reading. Ported verbatim from Pavivasa's scripts/verify/lib/net.mjs.
import net from 'node:net'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { pathExists } from './fs-util.mjs'

export async function findFreePort(preferred = 4173) {
  for (const port of [preferred, 0]) {
    const free = await new Promise((resolve) => {
      const srv = net.createServer()
      srv.once('error', () => resolve(null))
      srv.once('listening', () => {
        const p = port === 0 ? srv.address().port : port
        srv.close(() => resolve(p))
      })
      srv.listen(port, '127.0.0.1')
    })
    if (free) return free
  }
  throw new Error('Could not find a free port')
}

async function waitForServer(baseUrl, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(baseUrl, { signal: AbortSignal.timeout(1500) })
      if (res.status) return true
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

/**
 * Starts `next start` from `appDir` (always the real app directory — never
 * a defect-planting copy, see scripts/verify/README.md) on `port`. Returns
 * `{ baseUrl, stop() }`; `stop()` is safe to call multiple times.
 */
export async function startServer(appDir, port, extraEnv = {}) {
  const nextBin = path.join(appDir, 'node_modules', '.bin', 'next')
  if (!(await pathExists(nextBin))) {
    throw new Error(`No next binary at ${nextBin} — install dependencies first.`)
  }
  const baseUrl = `http://localhost:${port}`
  const env = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    NEXT_TELEMETRY_DISABLED: '1',
    ...extraEnv,
  }
  const child = spawn(nextBin, ['start', '-p', String(port)], {
    cwd: appDir,
    env,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (d) => (output += d.toString()))
  child.stderr.on('data', (d) => (output += d.toString()))

  let stopped = false
  const stop = () => {
    if (stopped || !child.pid) return
    stopped = true
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {
      try {
        child.kill('SIGTERM')
      } catch {
        /* already dead */
      }
    }
  }

  const ready = await waitForServer(baseUrl, 30000)
  if (!ready) {
    stop()
    throw new Error(`next start did not become ready in time. Output so far:\n${output}`)
  }
  return { baseUrl, stop, getOutput: () => output }
}
