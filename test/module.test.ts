// @ts-nocheck nuxt internals not typed!
import { setupTest, getNuxt, getContext } from '@nuxt/test-utils'

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
const callChokidarEvent = (eventName, filename = 'test.js') => Promise.all(watchers.map(w => w.fn(eventName, filename)))

describe('My test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console
  const componentsDirsHook = jest.fn()

  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true,
      hooks: {
        'components:dirs': componentsDirsHook,
        'build:before' (builder) {
          jest.spyOn(builder, 'generateRoutesAndFiles')
        }
      }
    }
  })

  test('displays autoImported components', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    expect(html).toContain('Foo')
    expect(html).toContain('Bar')
    expect(html).toContain('Base Button')
    expect(html).toContain('Icon Home')
  })

  test('displays overwritten component', async () => {
    const { html } = await nuxt.server.renderRoute('/')
    expect(html).toContain('app header')
  })

  test('displays autoImported components in pug template', async () => {
    const { html } = await getNuxt().server.renderRoute('/pug')
    expect(html).toContain('Foo')
    expect(html).toContain('Bar')
    expect(html).toContain('Base Button')
    expect(html).toContain('Icon Home')
  })

  test('watch: rebuild on add/remove', async () => {
    const { builder } = getContext()
    builder.generateRoutesAndFiles.mockClear()
    await callChokidarEvent('add')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(1)
    await callChokidarEvent('unlink')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(2)
  })

  test('watch: no rebuild on other events', async () => {
    const { builder } = getContext()
    builder.generateRoutesAndFiles.mockClear()
    await callChokidarEvent('foo')
    expect(builder.generateRoutesAndFiles).not.toHaveBeenCalled()
  })

  test('hook: components:dirs hook is called', () => {
    expect(componentsDirsHook).toHaveBeenCalled()
  })
})
