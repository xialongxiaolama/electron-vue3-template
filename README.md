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
├── public/
│
├── release/
│   └── x.x.x         #打包版本
│
├── src/
├── common/types/                    ← 统一接口定义
│   ├── device.ts                    ← DeviceDescriptor, DeviceState, DeviceMatchRule
│   ├── transport.ts                 ← ITransport, TransportOptions（合并旧 IConnection）
│   ├── protocol.ts                  ← IProtocol, ProtocolMessage, DecodedMessage
│   ├── framer.ts                    ← IFramer, FrameResult
│   ├── task.ts                      ← ITask, TaskStep, TaskResult
│   ├── ipc.ts                       ← 通道常量 + 类型安全映射
│   └── constants.ts                 ← 全局常量
│
├── main/core/                       ← 核心框架
│   ├── device-instance.ts           ← 重写：Framer→Protocol→请求响应关联
│   ├── device-manager.ts            ← 新增：生命周期、插件匹配、事件转发
│   └── task-runner.ts               ← 新增：重试/超时/顺序/并行
│
├── main/hardware/                   ← 硬件抽象层
│   ├── transports/
│   │   ├── hid.transport.ts         ← 新增：USB HID
│   │   ├── serial.transport.ts      ← 重写：串口
│   │   └── network.transport.ts     ← 新增：TCP/UDP
│   ├── protocols/bz/
│   │   ├── bz.protocol.ts           ← 从 BZService 迁移
│   │   └── bz.config.ts             ← BZ 命令表
│   └── framers/
│       ├── passthrough.framer.ts    ← HID 直通
│       ├── fixed-length.framer.ts   ← 固定包长
│       ├── delimiter.framer.ts      ← 分隔符
│       └── header-length.framer.ts  ← 帧头+长度
│
├── main/plugins/                    ← 插件系统
│   ├── plugin-registry.ts          ← 自动发现注册
│   └── bz/index.ts                 ← BZ 插件（示例）
│
├── main/ipc/device.ts              ← 新增：设备 IPC handler
│
├── preload/                         ← 安全桥接
│   ├── index.ts                     ← 重写：electronAPI 替代 raw ipcRenderer
│   └── api/                         ← 类型安全 API
│       ├── device.api.ts
│       ├── usb.api.ts
│       └── app.api.ts
│
├── renderer/                        ← 渲染层（仅 UI）
│   ├── api/                         ← 薄封装层
│   ├── hooks/                       ← Vue 组合式函数
│   │   ├── useDevice.ts
│   │   ├── useDeviceList.ts
│   │   └── useUsbDetect.ts
│   └── store/device/device.store.ts ← 统一设备 Store
│
└── types/electron.d.ts             ← 重写：window.electronAPI 类型
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

