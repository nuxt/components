import { posix as path } from 'path'
import { scanComponents } from '../../src/scan'

export function scanFixtureComponents () {
  const srcDir = path.resolve('test/fixture')
  return scanComponents([
    {
      path: path.resolve(srcDir, 'components'),
      pattern: '**/*.{vue,ts}'
    },
    {
      path: path.resolve(srcDir, 'components/base'),
      pattern: '**/*.{vue,ts}',
      prefix: 'base'
    },
    {
      path: path.resolve(srcDir, 'components/icons'),
      pattern: '**/*.{vue,ts}',
      prefix: 'icon'
    }
  ], srcDir)
}
