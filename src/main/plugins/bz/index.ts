/**
 * BZ 设备插件
 * 将 BZ 设备的 Transport + Protocol + Framer 组合注册到 DeviceManager
 *
 * 自动发现规则：plugins/bz/index.ts 被 PluginRegistry 自动加载
 */
import type { DevicePlugin } from '../../core/device-manager'
import { HidTransport } from '../../hardware/transports/hid.transport'
import { BZProtocol } from '../../hardware/protocols/bz/bz.protocol'
import { PassthroughFramer } from '../../hardware/framers/passthrough.framer'
import { BZ_CONFIG } from '../../hardware/protocols/bz/bz.config'

const plugin: DevicePlugin = {
  descriptor: {
    tag: 'BZ',
    name: 'BZ 鼻阻仪',
    type: 'usb',
    match: [
      { type: 'usb', vid: BZ_CONFIG.VID, pid: BZ_CONFIG.PID },
    ],
  },
  createTransport: (descriptor) => new HidTransport({
    type: 'usb',
    channel: `${descriptor.tag}:${descriptor.vid}:${descriptor.pid}`,
    vid: descriptor.vid,
    pid: descriptor.pid,
  }),
  createProtocol: () => new BZProtocol(),
  createFramer: () => new PassthroughFramer(), // HID 已自动分包，无需额外帧处理
}

export default plugin
