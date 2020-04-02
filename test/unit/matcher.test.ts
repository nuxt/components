import { matcher } from '../../src/scan'
import { scanFixtureComponents } from './scanner.test'

test('matcher', async () => {
  const components = await scanFixtureComponents()
  const tags = ['ComponentA', 'ComponentB', 'component-c']

  const matchedComponents = matcher(tags, components)
  expect(matchedComponents).toEqual(components)
})
