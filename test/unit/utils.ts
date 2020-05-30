import path from 'path'
import { scanComponents } from '../../src/scan'

export const warn = console.warn = jest.fn() // eslint-disable-line no-console

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
