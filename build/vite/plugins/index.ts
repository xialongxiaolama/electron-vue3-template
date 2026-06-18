import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { electronBuild } from './electron'
import { PluginOption } from 'vite'
import { vueRouterPlugin } from './vueRouter'
import { AutoImportDeps } from './autoImport';
import { AutoRegistryComponents } from './components'
import { ConfigProgressPlugin } from './progress'
import { SvgIconsPlugin } from './svgIcon';
import { configUnocss } from './unocss';
// import { ConfigCompressPlugin } from './compress';
// import { customConsoleLog } from './log'
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  // const { VITE_USE_MOCK, VITE_USE_COMPRESS } = viteEnv;
  // console.log('扩展参数', viteEnv)
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    //自动生成路由 要放在vue前
    vueRouterPlugin(),
    vue(),
    vueDevTools()
  ]
  
  //自动引入SVG图标
  vitePlugins.push(SvgIconsPlugin(isBuild))
  
  //自动导入Vue API ref 等
  vitePlugins.push(AutoImportDeps())

  //自动导入组件
  vitePlugins.push(AutoRegistryComponents())

  // electron 构建
  vitePlugins.push(electronBuild(isBuild))
  
  // UnoCSS支持
  vitePlugins.push(configUnocss())

  // 自定义打印 不需要
  // vitePlugins.push(customConsoleLog())

  //构建显示进度条
  vitePlugins.push(ConfigProgressPlugin())

  // if (isBuild) {
  //   // gz压缩  rollup-plugin-gzip
  //   vitePlugins.push(ConfigCompressPlugin());
  // }

  return vitePlugins
}
