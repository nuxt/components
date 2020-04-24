import { scanFixtureComponents } from './utils'

test('scanner', async () => {
  const components = await scanFixtureComponents()

  expect(components.map(c => c.pascalName)).toEqual([
    'Bar',
    'LazyBar',
    'Foo',
    'LazyFoo',
    'AnotherFoo',
    'LazyAnotherFoo'
  ])
})
