import path from 'path'
import { loader as WebpackLoader } from 'webpack'
import loader from '../../src/loader'
import { scanFixtureComponents } from './scanner.test'

let testLoader

beforeAll(async () => {
  const fixtureComponents = await scanFixtureComponents()
  testLoader = async (context: object, content?: string | Buffer): Promise<{ content: typeof content }> => {
    let finalContent: typeof content

    await loader.call({
      addDependency: (_file) => {},
      async: () => {},
      cacheable: (_bool) => {},
      callback: (_, newContent) => { finalContent = newContent },
      query: {
        getComponents: () => fixtureComponents
      },
      ...context
    } as WebpackLoader.LoaderContext, content)

    return { content: finalContent }
  }
})

test('default', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/index.vue') }, 'test')
  expect(content).toContain("require('~/components/ComponentFoo.vue')")
  expect(content).toContain("require('~/components/ComponentBar.ts')")
  expect(content).toContain("require('~/components/ComponentBaz.js')")
})

test('hot reload', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/index.vue') }, '/* hot reload */')
  expect(content).toContain("require('~/components/ComponentFoo.vue')")
  expect(content).toContain("require('~/components/ComponentBar.ts')")
  expect(content).toContain("require('~/components/ComponentBaz.js')")
})

test('resourceQuery is truthy', async () => {
  const { content } = await testLoader({ resourceQuery: 'something' }, 'test')
  expect(content).toEqual('test')
})

test('no matched components', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/no-components.vue') }, 'test')
  expect(content).toEqual('test')
})
