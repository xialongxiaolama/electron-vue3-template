# Electron  Vue 3  TypeScript  Vite

## 项目简介
这是一个基于 Electron、Vite、Typescript、组件库 和 Vue3 的基础框架项目，旨在快速构建桌面应用程序。该项目集成了各类插件，支持组件按需加载和自动注册、路由自动注册、i18n、TailwindCss、VueUse等。

## 项目结构
```sh
project-name/
│
├── build/
│   ├── vite/         #vite插件  
│   │   └── ...       #路由自动导入、组件按需加载等插件相关配置 
│   └── utils.ts
│
├── public/
│
├── release/
│   └── x.x.x         #打包版本
│
├── src/                   # 渲染进程页面
│   ├── common/            # 【共享层】主进程和渲染进程共用的代码
│   │   ├── types/         # 接口定义 (ITransport, IProtocol, DeviceInfo)
│   │   │   ├── device.ts  # 硬件相关的接口和枚举
│   │   │   ├── task.ts    # 任务相关的接口
│   │   │   └── ipc.ts     # IPC 通讯协议的类型定义
│   │   └── utils/         # 跨进程的工具函数 (如：字节处理、CRC计算)
│   │
│   ├── main/              # 【主进程层】核心逻辑
│   │   ├── core/          # 核心框架
│   │   │   ├── device-manager.ts   # 单例：管理所有设备实例的生命周期
│   │   │   ├── device-instance.ts  # 类：Transport + Protocol 的粘合剂
│   │   │   └── task-runner.ts      # 类：负责重试、超时控制的任务执行器
│   │   ├── hardware/      # 硬件实现细节 (基础设施层)
│   │   │   ├── transports/         # 传输实现 (ITransport 的子类)
│   │   │   │   ├── serial.transport.ts
│   │   │   │   ├── usb.transport.ts
│   │   │   │   └── mock.transport.ts
│   │   │   ├── protocols/          # 协议实现 (IProtocol 的子类)
│   │   │   │   ├── sensor.protocol.ts
│   │   │   │   ├── motor.protocol.ts
│   │   │   │   └── modbus.protocol.ts
│   │   │   └── framers/            # 粘包处理逻辑
│   │   │       └── default.framer.ts
│   │   ├── tasks/         # 具体的业务逻辑序列 (Task 模式)
│   │   │   ├── init-device.task.ts
│   │   │   └── upgrade-firmware.task.ts
│   │   ├── ipc/           # IPC 通讯分发
│   │   │   └── handlers.ts         # 所有的 ipcMain.handle 写在这里
│   │   └── main.ts        # 主进程入口
│   │
│   ├── preload/           # 【预加载层】
│   │   └── index.ts       # 使用 contextBridge 暴露安全接口
│   │
│   └── renderer/          # 【渲染进程层】UI 界面
│       ├── api/           # 封装对 window.deviceAPI 的调用
│       ├── hooks/         # 封装 React/Vue 的 Hook (如：useDeviceData)
│       ├── store/         # 全局状态管理 (Pinia/Redux)，管理设备连接状态
│       └── views/         # UI 页面
```
## 特性
- 组件按需引入,组件自动注册,直接引用使用
- 路由自动注册,无需手动添加
- Electron 初始配置不断完善
- 内置vue-devtools工具 快捷开发调试
- ...

## 项目环境

node >: v20

python : 3.9
<!-- node-gyp@9.4 依赖于python 中的distutils 。从python3.11开始distutils 被setuptools 工具替代 -->

## 快速开始

```sh
# 推荐安装 pnpm node > v20
npm i -g pnpm 

# 安装依赖
pnpm i

# 如果需要使用serialport 插件,需要运行 (新版本node 已经包含了这些模块,不用下载)
# serialport 插件包含C++扩展,需要 node-gyp 将C++编译为 node 可加载.node 二进制模块
# node-gyp 基于GYP 构建系统, GYP时python编写, 所以运行时需要python 环境和 window 原生C++的相关开发依赖
# npm --python-mirror=https://npmmirror.com/mirrors/python/  install --global windows-build-tools


# 运行
pnpm dev
```

## 构建
```sh
pnpm build
```

