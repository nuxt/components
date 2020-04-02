import { matcher } from '../../src/scan'
import { scanFixtureComponents } from './scanner.test'

test('matcher', async () => {
  const components = await scanFixtureComponents()
  const tags = ['ComponentFoo', 'ComponentBar', 'component-baz']

  const matchedComponents = matcher(tags, components).sort((a, b) => a.name < b.name ? -1 : 1)
  expect(matchedComponents).toEqual(components.sort((a, b) => a.name < b.name ? -1 : 1))
})
