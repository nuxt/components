import { requireNuxtVersion } from '../../src/compatibility'

test('should throw error if Nuxt version not supported', () => {
  const nuxt = { constructor: { version: 'v2.9.0' } }
  expect(() => requireNuxtVersion(nuxt, '2.10')).toThrowError()
})
