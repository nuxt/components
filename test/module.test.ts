import path from 'path'
import { loadNuxt } from '@nuxt/core-edge'
import { getBuilder } from '@nuxt/builder-edge'

jest.setTimeout(60000)
jest.mock('esm', () => module => (file: string) => /.(js|mjs)$/.test(file) ? jest.requireActual('esm')(module)(file) : require(file))

const warn = console.warn = jest.fn() // eslint-disable-line no-console

const watchers: any[] = []

jest.mock('chokidar', () => ({
  watch () {
    return {
      close: jest.fn(),
      on (event, fn) {
        watchers.push({ event, fn })
      }
    }
  }
}))

const callChokidarEvent = eventName => Promise.all(watchers.map(w => w.fn(eventName)))

describe('module', () => {
  let nuxt, builder, hookFn

  beforeAll(async () => {
    nuxt = await loadNuxt({ rootDir: path.resolve('test/fixture'), for: 'dev' })
    builder = getBuilder(nuxt)
    hookFn = jest.fn()
    nuxt.hook('components:dirs', hookFn)

    await builder.build()
    expect(warn).toBeCalledWith('Components directory not found: `~/non-existent`')

    builder.generateRoutesAndFiles = jest.fn()
  })

  test('displays autoImported components', async () => {
    const { html } = await nuxt.server.renderRoute('/')
    expect(html).toContain('Foo')
    expect(html).toContain('Bar')
    expect(html).toContain('Base Button')
    expect(html).toContain('Icon Home')
  })

  test('displays autoImported components in pug template', async () => {
    const { html } = await nuxt.server.renderRoute('/pug')
    expect(html).toContain('Foo')
    expect(html).toContain('Bar')
    expect(html).toContain('Base Button')
    expect(html).toContain('Icon Home')
  })

  test('watch: rebuild on add/remove', async () => {
    builder.generateRoutesAndFiles.mockClear()
    await callChokidarEvent('add')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(1)
    await callChokidarEvent('unlink')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(2)
  })

  test('watch: no rebuild on other events', async () => {
    builder.generateRoutesAndFiles.mockClear()
    await callChokidarEvent('foo')
    expect(builder.generateRoutesAndFiles).not.toHaveBeenCalled()
  })

  test('hook: components:dirs hook is called', () => {
    expect(hookFn).toHaveBeenCalled()
  })

  afterAll(async () => {
    await nuxt.close()
  })
})
