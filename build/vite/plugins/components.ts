/**
 * @name AutoRegistryComponents
 * @description 自动注册本地组件和按需加载 UI 库的组件
 */
import Components from 'unplugin-vue-components/vite'

import {
  ElementPlusResolver,
  VueUseComponentsResolver,
} from 'unplugin-vue-components/resolvers'

import {PrimeVueResolver} from '@primevue/auto-import-resolver';
export const AutoRegistryComponents = () =>{
  return Components({
    dirs: ['src/components'],
    extensions: ['vue', 'md'],
    deep: true,
    dts: 'types/components.d.ts',// 生成自动引入组件的声明文件
    directoryAsNamespace: false,
    globalNamespaces: [],
    directives: true,
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    resolvers: [
      ElementPlusResolver(),
      PrimeVueResolver(),
      VueUseComponentsResolver(),
    ]
  });
}