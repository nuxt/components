import { promises as fs } from 'fs'
import { resolve } from 'path'
import { compileToFunctions } from 'vue-template-compiler'
import { loader, DISABLE_COMMENT } from '../../src/loader'
import { scanFixtureComponents } from './utils'

test('loader', async () => {
  const components = await scanFixtureComponents()

  const transform = (code:string) => loader.raw({
    findComponent (name) {
      return components.find(i => i.pascalName === name || i.kebabName === name)
    }
  }, {} as any).transform.call(null, code, '')

  expect(await transform(DISABLE_COMMENT)).toBeFalsy()

  const compiledTemplate = compileToFunctions(`
  <div>
    <Header />
    <Foo />
    <LazyBar />
    <BaseButton />
    <IconHome />
    <MAwesome />
    <Functional />
    <NComponent />
  </div>  
  `).render.toString()
  expect((await transform(compiledTemplate)).code).toMatchSnapshot()
})
