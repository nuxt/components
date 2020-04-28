import { matcher } from '../../src/scan'
import { scanFixtureComponents } from './utils'

test('matcher', async () => {
  const components = await scanFixtureComponents()
  const tags = ['Foo', 'LazyBar', 'BaseButton', 'IconHome']

  const matchedComponents = matcher(tags, components).sort((a, b) => a.pascalName < b.pascalName ? -1 : 1)

  expect(matchedComponents).toHaveLength(4)
})
