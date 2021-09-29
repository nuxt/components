export interface Component {
  pascalName: string
  kebabName: string
  import: string
  asyncImport: string
  export: string
  filePath: string
  shortPath: string
  isAsync?: boolean
  chunkName: string
  /** @deprecated */
  global: boolean
  level: number
  prefetch: boolean | number
  preload: boolean | number
  magicComments: string
}

export interface ScanDir {
  path: string
  pattern?: string | string[]
  ignore?: string[]
  prefix?: string
  isAsync?: boolean
  /** @deprecated */
  global?: boolean | 'dev'
  pathPrefix?: boolean
  level?: number
  prefetch?: boolean | number
  preload?: boolean | number
  extendComponent?: (component: Component) => Promise<Component | void> | (Component | void)
}

export interface ComponentsDir extends ScanDir {
  watch?: boolean
  extensions?: string[]
  transpile?: 'auto' | boolean
}

export type componentsDirHook = (dirs: ComponentsDir[]) => void | Promise<void>
export type componentsExtendHook = (components: (ComponentsDir | ScanDir)[]) => void | Promise<void>

export interface Options {
  dirs: (string | ComponentsDir)[]
  loader: Boolean
}

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    components: boolean | Options | Options['dirs']
  }
}

declare module '@nuxt/types/config/hooks' {
  interface NuxtOptionsHooks {
    'components:dirs'?: componentsDirHook
    'components:extend'?: componentsExtendHook
    components?: {
      dirs?: componentsDirHook
      extend?: componentsExtendHook
    }
  }
}
