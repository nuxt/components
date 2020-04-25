import path from 'path'
import { scanComponents } from '../../src/scan'

export function scanFixtureComponents () {
  return scanComponents([
    {
      path: path.resolve('test/fixture/components'),
      pattern: '**/*.{vue,ts}'
    },
    {
      path: path.resolve('test/fixture/prefixed'),
      pattern: '**/*.{vue,ts}',
      prefix: 'prefixed'
    }
  ])
}
