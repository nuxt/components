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
    'NComponent',
    'Foo',
    'Functional',
    'FunctionalChild',
    'FormInputText',
    'FormInputTextArea',
    'FormInputRadio',
    'FormLayoutsLayout',
    'Header',
    'DeepNestedMyComponent',
    'UiNotificationWrapper',
    'MyFormFancyButton'
  ]

  expect(components.map(c => c.pascalName).sort()).toEqual(expectedComponents.sort())

  expect(warn).toBeCalledWith(
    expect.stringMatching('Two component files resolving to the same name `BaseSecondButton`')
  )
})
