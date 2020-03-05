import { scanFixtureComponents } from './utils'

test('scanner', async () => {
  const components = await scanFixtureComponents()

  expect(components).toHaveLength(2)
})
