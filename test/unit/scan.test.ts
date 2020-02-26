import path from 'path'
import { scanComponents } from '../../src/scan'

describe('scan', () => {
  test('A', async () => {
    const components = await scanComponents({
      dir: path.resolve('test/fixture/components'),
      extensions: ['vue']
    })
    expect(components).toHaveLength(2)
  })
})
