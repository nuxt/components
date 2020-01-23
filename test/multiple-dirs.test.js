const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('multiple-dirs', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'multiple-dirs'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
    expect(html).toContain('foo content')
    expect(html).toContain('bar content')
  })
})
