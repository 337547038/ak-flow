/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'virtual:generated-pages' {
  const routesList: any[]
  export default routesList
}
declare module 'vue-router'
declare module 'axios'
declare module 'vue'
declare module 'vite-plugin-pages'
declare module 'vite'
declare module 'pinia'
declare module 'nprogress'
declare module '~pages'
declare module '@logicflow/core'
declare module '@logicflow/extension'
declare module 'Clipboard'