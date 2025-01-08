/**
 * @name AutoImport
 * @description 自动导入模块的 API，例如 ref 和 useRoute等
 */

import AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router';
export const AutoImportDeps = () => {
  return AutoImport({
    dts:'types/auto-imports.d.ts',
    imports:[
      'vue',
      'pinia',
      {
        '@vueuse/core': [],
      },
      VueRouterAutoImports,
    ],
    resolvers: [],
  })
}