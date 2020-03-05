import path from 'path'
import { scanComponents } from '../../src/scan'

export function scanFixtureComponents () {
  return scanComponents({
    dir: path.resolve('test/fixture/components'),
    extensions: ['vue']
  })
}
