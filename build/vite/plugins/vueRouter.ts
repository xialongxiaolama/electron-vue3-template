/**
 * @name vueRouterPlugin
 * @description: 动态生成路由
 */

import VueRouter from 'unplugin-vue-router/vite'
// import Layouts from 'vite-plugin-vue-layouts';
/**
 *  为自动生成的路由生成 外层layout布局
 * 
 *  */
// 未生效
// export const vueRouterLayoutPlugin = () => {
//   return Layouts({
//     layoutsDirs: '/src/layout',
//     pagesDirs: '/src/views'
//   })
// }

export const vueRouterPlugin = () => {
  return VueRouter({
    routesFolder: [
      // {
      //   src: 'src/layout',
      //   path: '',
      //   // exclude: ['**/components/**'],
      // },
      {
        src: 'src/renderer/views',
        path: '',
      },
    ], //生成路由文件夹
    dts: 'types/typed-router.d.ts', //生成路由类型文件
    extensions: ['.page.vue', '.vue', '.md'], //生成路由的扩展名
    exclude: ['**/components/**','**/login/**'], //排除生成路由的文件夹
  })
}
