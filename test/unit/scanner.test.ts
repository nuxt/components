import path from 'path'
import { scanComponents } from '../../src/scan'

export function scanFixtureComponents () {
  return scanComponents({
    cwd: path.resolve('test/fixture'),
    pattern: 'components/**/*.{vue,ts,js}'
  })
}

test('scanner', async () => {
  const components = await scanFixtureComponents()

  expect(components).toHaveLength(3)
})
