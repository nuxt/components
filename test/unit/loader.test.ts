import path from 'path'
import { loader as WebpackLoader } from 'webpack'
import loader from '../../src/loader'
import { scanFixtureComponents } from './utils'

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
  expect(content).toContain("import('~/components/ComponentA.vue')")
  expect(content).toContain("import('~/components/ComponentB.vue')")
})

test('hot reload', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/index.vue') }, '/* hot reload */')
  expect(content).toContain("import('~/components/ComponentA.vue')")
  expect(content).toContain("import('~/components/ComponentB.vue')")
})

test('resourceQuery is truthy', async () => {
  const { content } = await testLoader({ resourceQuery: 'something' }, 'test')
  expect(content).toEqual('test')
})

test('no matched components', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/no-components.vue') }, 'test')
  expect(content).toEqual('test')
})
