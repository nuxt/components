
import chalk from 'chalk'
import semver from 'semver'
import { ModuleThis } from '@nuxt/types/config/module'

export function requireNuxtVersion (this: ModuleThis, version: string) {
  const pkgName = require('../package.json').name
  const currentVersion = semver.coerce(this.nuxt.constructor.version)!
  const requiredVersion = semver.coerce(version)!

  if (semver.lt(currentVersion, requiredVersion)) {
    throw new Error(`\n
      ${chalk.cyan(pkgName)} is not compatible with your current Nuxt version : ${chalk.red('v' + currentVersion)}\n
      Required: ${chalk.green('v' + requiredVersion)} or ${chalk.cyan('higher')}
    `)
  }
}
