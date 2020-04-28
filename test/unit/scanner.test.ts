import { scanFixtureComponents } from './utils'

test('scanner', async () => {
  const components = await scanFixtureComponents()

  expect(components.map(c => c.pascalName)).toEqual([
    'BaseButton',
    'LazyBaseButton',
    'IconHome',
    'LazyIconHome',
    'Bar',
    'LazyBar',
    'Foo',
    'LazyFoo'
  ])
})
