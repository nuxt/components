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
    'PAScal',
    'Foo',
    'Functional',
    'FunctionalChild',
    'FormInputText',
    'FormInputTextArea',
    'FormInputRadio',
    'FormLayout',
    'Header',
    'DeepNestedMyComponent',
    'UiNotificationWrapper'
  ]

  expect(components.map(c => c.pascalName).sort()).toEqual(expectedComponents.sort())

  expect(warn).toBeCalledWith(
    expect.stringMatching('Two component files resolving to the same name `BaseSecondButton`')
  )
})
