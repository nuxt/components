import { requireNuxtVersion } from '../../src/compatibility'

test('should throw error if Nuxt version not supported', () => {
  expect(() => requireNuxtVersion('v2.9.0', '2.10')).toThrowError()
  expect(() => requireNuxtVersion('v2.11.0', '2.10')).not.toThrowError()
  expect(() => requireNuxtVersion(null, '2.10')).not.toThrowError()
})
