import path from 'path'
import { loadNuxt } from '@nuxt/core-edge'
import { build } from '@nuxt/builder-edge'

jest.setTimeout(60000)
jest.mock('esm', () => module => (file: string) => /.(js|mjs)$/.test(file) ? jest.requireActual('esm')(module)(file) : require(file))

test('module', async () => {
  const nuxt = await loadNuxt({ rootDir: path.resolve('test/fixture'), for: 'dev' })
  await build(nuxt)

  const { html } = await nuxt.server.renderRoute('/')

  expect(html).toContain('Foo')
  expect(html).toContain('Bar')
  expect(html).toContain('Baz')

  await nuxt.close()
})
