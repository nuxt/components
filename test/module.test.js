const { join } = require('path')
const { loadConfig, init } = require('@nuxtjs/module-test-utils')
const chokidar = require('chokidar')
const globby = require('globby')

// Mock globby
jest.mock('globby')
const toGlobbyFiles = arr => arr.map(name => ({ name, path: join('/project/nuxt', name) }))
globby.mockImplementation(() => toGlobbyFiles(['a.js', 'b.global.js', 'c.global.js']))

// Mock chokidar
const chokidarWatchers = []
const mockWatcher = {
  close: jest.fn(),
  on (event, fn) {
    chokidarWatchers.push({ event, fn })
  }
}
chokidar.watch = () => mockWatcher
const callChokidarEvent = eventName => Promise.all(chokidarWatchers.map(w => w.fn(eventName)))

describe('module', () => {
  let nuxt, builder

  beforeAll(async () => {
    nuxt = await init(loadConfig(__dirname, undefined, { dev: true }))
    builder = {
      generateRoutesAndFiles: jest.fn()
    }
    await nuxt.callHook('build:before', builder)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('discover components and pass as componentOptions', () => {
    const plugin = nuxt.options.build.templates.find(p => p.dst.includes('global-components'))
    expect(plugin.options).toMatchSnapshot()
  })

  test('watch: no rebuild if no matched files changed', async () => {
    builder.generateRoutesAndFiles.mockClear()
    await callChokidarEvent('add')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(0)
  })

  test('watch:rebuild on add/remove', async () => {
    builder.generateRoutesAndFiles.mockClear()
    globby.mockImplementationOnce(() => toGlobbyFiles(['a.js', 'b.global.js']))

    await callChokidarEvent('unlink')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(1)
  })

  test('watch:no rebuild on other events', async () => {
    builder.generateRoutesAndFiles.mockClear()
    globby.mockImplementationOnce(() => toGlobbyFiles(['a.js', 'b.global.js']))

    await callChokidarEvent('foo')
    expect(builder.generateRoutesAndFiles).toHaveBeenCalledTimes(0)
  })
})
