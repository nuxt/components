import path from 'upath'
import { scanComponents } from '../../src/scan'

export const warn = console.warn = jest.fn() // eslint-disable-line no-console

export function scanFixtureComponents () {
  const srcDir = path.resolve('test/fixture')
  return scanComponents([
    {
      path: path.resolve(srcDir, 'components'),
      pattern: '**/*.{vue,js,ts}'
    },
    {
      path: path.resolve(srcDir, 'components/base'),
      pattern: '**/*.{vue,js,ts}',
      prefix: 'base'
    },
    {
      path: path.resolve(srcDir, 'components/global'),
      pattern: '**/*.{vue,js,ts}'
    },
    {
      path: path.resolve(srcDir, 'components/multifile'),
      pattern: '**/*.{vue,js,ts}'
    },
    {
      path: path.resolve(srcDir, 'components/icons'),
      pattern: '**/*.{vue,js,ts}',
      prefix: 'icon'
    }
  ], srcDir)
}
