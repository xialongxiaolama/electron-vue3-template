# Electron  Vue 3  TypeScript  Vite PrimeVue

## 项目简介
这是一个基于 Electron、Vite、Typescript、PrimeVue组件库 和 Vue3 的基础框架项目，旨在快速构建桌面应用程序。该项目集成了各类插件，支持组件按需加载和自动注册、路由自动注册、i18n、TailwindCss、VueUse等。

## 项目结构
```sh
project-name/
│
├── build/
│   ├── vite/         #vite插件  
│   │   └── ...       #路由自动导入、组件按需加载等插件相关配置 
│   └── utils.ts
│
├── electron/
│   ├── main/         #electron主进程  
│   │   ├── ipc/      #进程间通讯文件
│   │   ├── menu.ts   #菜单配置
│   │   ├── ...
│   │   └── tray.ts   #托盘配置
│   └── preload/      #预加载文件 向渲染进程暴露主进程接口
│
├── public/
│
├── release/
│   └── x.x.x         #打包版本
│
├── type/             #ts声明文件
│
├── src/              #渲染进程页面
│    ├── assets/      #静态资源
│    ├── components/  #公共组件 该目录下组件自动注册
│    ├── layout/      #页面布局
│    ├── locals/      #i18n
│    ├── router/      #
│    ├── store/        
│    ├── utils/        
│    ├── views/ 
│    ├── ...
│    └── App.vue       

```
## 特性
- 组件按需引入,组件自动注册,直接引用使用
- 路由自动注册,无需手动添加
- Electron 初始配置不断完善
- 内置vue-devtools工具 快捷开发调试
- ...


## 快速开始

```sh
# 克隆项目
https://gitee.com/xialongxiaolama/electron-vue.git

# 切换分支
 git checkout v1

# 推荐安装 pnpm node > v18
npm i -g pnpm 

# 安装依赖
pnpm i

# 运行
pnpm dev
```

## 构建
```sh
pnpm build
```

