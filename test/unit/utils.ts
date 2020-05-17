import { posix as path } from 'path'
import { scanComponents } from '../../src/scan'

export function scanFixtureComponents () {
  return scanComponents([
    {
      path: path.resolve('test/fixture/components'),
      pattern: '**/*.{vue,ts}'
    },
    {
      path: path.resolve('test/fixture/components/base'),
      pattern: '**/*.{vue,ts}',
      prefix: 'base'
    },
    {
      path: path.resolve('test/fixture/components/icons'),
      pattern: '**/*.{vue,ts}',
      prefix: 'icon'
    }
  ])
}
