import path from 'path'
import { scanComponents } from '../../src/scan'

export function scanFixtureComponents () {
  return scanComponents({
    cwd: path.resolve('test/fixture'),
    patterns: ['components/**/*.{vue,ts}', 'another/**/*.{vue,ts}']
  })
}
