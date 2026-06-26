/**
 * BZ 设备协议配置
 * 从旧 BZService 中提取的命令表和参数
 */

export const BZ_CONFIG = {
  VID: 0x0483,
  PID: 0xB601,

  /** 发送命令表：命令名 -> 字节数组 */
  sendCommands: {
    sendZeroCalibration: [0xA5, 0x01, 0x55],     // 0点校准
    sendRestartDevice: [0xA5, 0x01, 0x55],         // 设备重启
    sendDeviceInfo: [0xA5, 0x01, 0x55],            // 获取鼻阻设备信息
    sendDeviceIEME: [0xA5, 0x01, 0x55],            // 设备手柄编号
    sendMeasuring: [0xA5, 0x01, 0x55],             // 开始测量
    sendStandardCalibration: [0xA5, 0x01, 0x55],   // 开始标准定标
    sendThreeCalibration: [0xA5, 0x01, 0x55],      // 开始3流量定标
    sendCalibrationVerify: [0xA5, 0x01, 0x55],     // 开始定标验证
  } as Record<string, number[]>,

  /** 接收命令表：命令字节十六进制 -> 处理方法名 */
  receiveCommands: {
    E0: 'receiveZeroCalibration',       // 0点校准
    A1: 'receiveRestartDevice',          // 设备重启
    A5: 'receiveDeviceInfo',             // 获取鼻阻设备信息
    A6: 'receiveDeviceIEME',             // 设备手柄编号
    A9: 'receiveMeasuring',              // 开始测量
    E3: 'receiveStandardCalibration',    // 开始标准定标
    C3: 'receiveThreeCalibration',       // 开始3流量定标
    C0: 'receiveCalibrationVerify',      // 开始定标验证
  } as Record<string, string>,

  /** 请求-响应映射：发送命令 -> 对应接收命令 */
  requestResponseMap: {
    sendDeviceInfo: 'receiveDeviceInfo',
    sendDeviceIEME: 'receiveDeviceIEME',
    sendZeroCalibration: 'receiveZeroCalibration',
    sendRestartDevice: 'receiveRestartDevice',
    sendMeasuring: 'receiveMeasuring',
    sendStandardCalibration: 'receiveStandardCalibration',
    sendThreeCalibration: 'receiveThreeCalibration',
    sendCalibrationVerify: 'receiveCalibrationVerify',
  } as Record<string, string>,
} as const
