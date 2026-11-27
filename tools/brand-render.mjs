// Renders the Holm brand assets from public/brand/logo.html with the system Edge.
// Usage: node tools/brand-render.mjs   (no downloads; Google Fonts must be reachable)
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const PAGE = pathToFileURL(resolve(ROOT, 'public/brand/logo.html')).href
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
].find(existsSync)
if (!EDGE) throw new Error('Microsoft Edge not found')

// [output under public/, query, width, height, transparent]
const JOBS = [
  ['og-default.png',             'v=og',               1200, 630,  false],
  ['brand/logo-stacked.png',     'v=stacked&bg=cream', 1080, 1080, false],
  ['brand/logo-stacked-dark.png','v=stacked&bg=dark',  1080, 1080, false],
  ['brand/logo-wide.png',        'v=wide&bg=cream',    1600, 600,  false],
  ['brand/logo-wide-dark.png',   'v=wide&bg=dark',     1600, 600,  false],
  ['brand/mark-512.png',         'v=mark',             512,  512,  true],
  ['apple-touch-icon.png',       'v=icon&bg=cream',    512,  512,  false]
]

for (const [out, qs, w, h, alpha] of JOBS) {
  const file = resolve(ROOT, 'public', out)
  const args = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=8000',
    `--window-size=${w},${h}`, `--screenshot=${file}`
  ]
  if (alpha) args.push('--default-background-color=00000000')
  args.push(`${PAGE}?${qs}&w=${w}&h=${h}`)
  execFileSync(EDGE, args, { stdio: 'ignore' })
  console.log('rendered', out)
}
