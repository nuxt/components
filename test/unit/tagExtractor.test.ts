import { posix as path } from 'path'
import { extractTags } from '../../src/tagExtractor'

test('with template', async () => {
  const tags = await extractTags(path.resolve('test/fixture/pages/index.vue'))

  expect(tags).toHaveLength(5)
  expect(tags).toEqual(['Foo', 'LazyBar', 'BaseButton', 'IconHome', 'div'])
})

test('without template', async () => {
  const tags = await extractTags(path.resolve('test/fixture/pages/no-template.vue'))

  expect(tags).toHaveLength(0)
})
