import { warn, scanFixtureComponents } from './utils'

test('scanner', async () => {
  const components = await scanFixtureComponents()

  const expectedComponents = [
    'BaseButton',
    'ComponentC',
    'BaseSecondButton',
    'IconHome',
    'Bar',
    'Big',
    'Mouse',
    'Foo',
    'Functional',
    'FunctionalChild'
  ]

  expect(components.map(c => c.pascalName).sort()).toEqual([
    ...expectedComponents,
    ...expectedComponents.map(n => 'Lazy' + n)
  ].sort())

  expect(warn).toBeCalledWith(
    expect.stringMatching('Two component files resolving to the same name `SecondButton`')
  )
})
