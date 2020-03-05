import { matcher } from '../../src/scan'
import { scanFixtureComponents } from './utils'

test('matcher', async () => {
  const components = await scanFixtureComponents()
  const tags = ['ComponentA', 'component-b']

  const matchedComponents = matcher(tags, components)
  expect(matchedComponents).toEqual(components)
})
