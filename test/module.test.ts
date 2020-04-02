import { Nuxt } from '@nuxt/core-edge'
import { Builder } from '@nuxt/builder-edge'
import { BundleBuilder } from '@nuxt/webpack-edge'

jest.setTimeout(60000)

test('module', async () => {
  const config = require('./fixture/nuxt.config').default
  const nuxt = new Nuxt({ ...config, dev: true })

  const builder = new Builder(nuxt, BundleBuilder)
  await builder.build()

  const { html } = await nuxt.server.renderRoute('/')

  expect(html).toContain('Foo')
  expect(html).toContain('Bar')
  expect(html).toContain('Baz')

  await nuxt.close()
})
