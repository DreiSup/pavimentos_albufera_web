#!/usr/bin/env node
// scripts/verify/build-and-scan-secrets.mjs [appDir]
//
// Wraps secrets-scan.mjs's two-step requirement (its OWN build, made with
// sentinel values for the server-only env vars, then a scan of THAT build)
// into a single command, reading those sentinel values from
// `sentinels.mjs` — the single source of truth — instead of requiring the
// caller (a human running this locally, or `.github/workflows/ci.yml`) to
// set them by hand in two separate places that could drift apart.
//
// Ported verbatim (project-agnostic) from Pavivasa's scripts/verify/
// build-and-scan-secrets.mjs.
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SENTINEL_ENV } from './sentinels.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')
const appDir = process.argv[2] ?? 'apps/web'
const env = { ...process.env, ...SENTINEL_ENV }

function run(label, command, args) {
  console.log(`\n> [${label}] ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, { cwd: repoRoot, env, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    console.error(`build-and-scan-secrets: "${label}" exited ${result.status}`)
    process.exit(result.status ?? 1)
  }
}

// Deliberately `pnpm --filter web build` (the deterministic build command,
// bypassing turbo's cache) — this build's whole point is a fresh compile
// with THESE sentinel values baked in; a cached build from a previous,
// differently-valued run would defeat the scan silently.
run('build with sentinel secrets', 'pnpm', ['--filter', 'web', 'build'])
run('scan for secret leaks', 'node', [path.join(__dirname, 'secrets-scan.mjs'), appDir])
