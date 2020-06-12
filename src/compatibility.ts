
import chalk from 'chalk'
import semver from 'semver'

export function requireNuxtVersion (nuxt: any, version: string) {
  const pkgName = require('../package.json').name
  const currentVersion = semver.coerce(nuxt?.constructor?.version || '0.0.0')!
  const requiredVersion = semver.coerce(version || '0.0.0')!

  if (semver.lt(currentVersion, requiredVersion)) {
    throw new Error(`\n
      ${chalk.cyan(pkgName)} is not compatible with your current Nuxt version : ${chalk.yellow('v' + currentVersion)}\n
      Required: ${chalk.green('v' + requiredVersion)} or ${chalk.cyan('higher')}
    `)
  }
}
