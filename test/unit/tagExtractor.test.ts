import path from 'path'
import { extractTags } from '../../src/tagExtractor'

test('with template', async () => {
  const tags = await extractTags(path.resolve('test/fixture/pages/index.vue'))

  expect(tags).toHaveLength(3)
  expect(tags).toEqual(['ComponentA', 'ComponentB', 'div'])
})

test('without template', async () => {
  const tags = await extractTags(path.resolve('test/fixture/pages/no-template.vue'))

  expect(tags).toHaveLength(0)
})
