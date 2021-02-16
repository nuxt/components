import path from 'upath'
import { scanComponents } from '../../src/scan'

export const warn = console.warn = jest.fn() // eslint-disable-line no-console

// TODO: This is a dummy test! Actual array is in src/index
const ignorePatterns = [
  '**/*.stories.{js,ts,jsx,tsx}', // ignore storybook files
  '**/*{M,.m,-m}ixin.{js,ts,jsx,tsx}', // ignore mixins
  '**/*.d.ts' // .d.ts files
]

export function scanFixtureComponents () {
  const srcDir = path.resolve('test/fixture')
  return scanComponents([
    {
      path: path.resolve(srcDir, 'components'),
      pattern: '**/*.{vue,js,ts}',
      ignore: ignorePatterns
    },
    {
      path: path.resolve(srcDir, 'components/base'),
      pattern: '**/*.{vue,js,ts}',
      prefix: 'base',
      ignore: ignorePatterns
    },
    {
      path: path.resolve(srcDir, 'components/global'),
      pattern: '**/*.{vue,js,ts}',
      ignore: ignorePatterns
    },
    {
      path: path.resolve(srcDir, 'components/multifile'),
      pattern: '**/*.{vue,js,ts}',
      ignore: ignorePatterns
    },
    {
      path: path.resolve(srcDir, 'components/icons'),
      pattern: '**/*.{vue,js,ts}',
      prefix: 'icon',
      ignore: ignorePatterns
    }
  ], srcDir)
}
