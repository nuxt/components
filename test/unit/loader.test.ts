import path from 'path'
import { loader as WebpackLoader } from 'webpack'
import loader from '../../src/loader'
import { scanFixtureComponents } from './utils'

const isWindows = process.platform.startsWith('win')

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
        dependencies: [],
        getComponents: () => fixtureComponents
      },
      ...context
    } as WebpackLoader.LoaderContext, content)

    return { content: finalContent }
  }
})

function expectToContainImports (content: string) {
  const fixturePath = p => path.resolve('test/fixture', p).replace(/\\/g, '\\\\')
  expect(content).toContain(`require('${fixturePath('components/Foo.vue')}')`)
  expect(content).toContain(`function () { return import('${fixturePath('components/Bar.ts')}' /* webpackChunkName: "components${isWindows ? '_' : '/'}Bar" */).then(function(m) { return m['default'] || m }) }`)
  expect(content).toContain(`require('${fixturePath('components/base/Button.vue')}')`)
  expect(content).toContain(`require('${fixturePath('components/icons/Home.vue')}')`)
}

test('default', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/index.vue') }, 'test')
  expectToContainImports(content)
})

test('hot reload', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/index.vue') }, '/* hot reload */')
  expectToContainImports(content)
})

test('resourceQuery is truthy', async () => {
  const { content } = await testLoader({ resourceQuery: 'something' }, 'test')
  expect(content).toEqual('test')
})

test('no matched components', async () => {
  const { content } = await testLoader({ resourcePath: path.resolve('test/fixture/pages/no-components.vue') }, 'test')
  expect(content).toEqual('test')
})
