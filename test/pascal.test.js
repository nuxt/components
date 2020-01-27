const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('pascal', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'pascal'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
    expect(html).toContain('bar content')
    expect(html).toContain('bar foo content')
    expect(html).toContain('foo content')
    expect(html).toContain('foo bar content')
  })
})
