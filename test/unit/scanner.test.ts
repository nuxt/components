import { warn, scanFixtureComponents } from './utils'

test('scanner', async () => {
  const components = await scanFixtureComponents()

  const expectedComponents = [
    'BaseButton',
    'BaseSecondButton',
    'IconHome',
    'Bar',
    'Foo'
  ]

  expect(components.map(c => c.pascalName).sort()).toEqual([
    ...expectedComponents,
    ...expectedComponents.map(n => 'Lazy' + n)
  ].sort())

  expect(warn).toBeCalledWith(
    expect.stringMatching('Two component files resolving to the same name `SecondButton`')
  )
})
