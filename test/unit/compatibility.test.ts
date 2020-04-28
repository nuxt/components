import { ModuleThis } from '@nuxt/types/config/module'
import { requireNuxtVersion } from '../../src/compatibility'

test('should throw error if Nuxt version not supported', () => {
  const moduleThis: ModuleThis = { nuxt: { constructor: { version: 'v2.9.0' } } } as ModuleThis
  expect(() => requireNuxtVersion.call(moduleThis, '2.10')).toThrowError()
})
