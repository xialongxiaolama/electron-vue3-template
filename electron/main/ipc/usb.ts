import { ipcMain } from "electron";
import { SerialPort } from 'SerialPort';
import { usb , getDeviceList } from "usb";

// handle 监听 ipcRenderer.invoke 事件
// handleOnce 监听 ipcRenderer.invoke 事件,只监听一次

// on  监听 ipcRenderer.send 事件
// once  监听 ipcRenderer.send 事件,只监听一次

// 区别 : send 仅用来发送信息 ,on仅监听信息
//       invoke 发送信息,并接收返回的信息(可以返回Promise异步), handle监听信息,并返回指定内容

interface Device {
  busNumber: number; // 表示 USB 设备所连接的总线编号。在计算机系统中，USB 主机控制器可以管理多条总线，每个 USB 设备都连接到其中一条总线上。busNumber 用于区分不同的总线，范围通常从 1 开始编号。
  deviceAddress: number; // 指设备在其连接的总线上的唯一地址。当多个设备连接到同一条 USB 总线上时，每个设备会被分配一个唯一的地址，用于在总线上进行通信识别。
  deviceDescriptor: {
    bDescriptorType: number; // 表示描述符的类型。在 USB 协议中，不同类型的描述符用于描述不同的信息，bDescriptorType 为 1 表示这是一个设备描述符
    bDeviceClass:number; // 定义了设备的通用类别。不同的类别代表不同类型的设备，例如，0 表示该设备的类代码由接口描述符定义，而不是由设备描述符整体定义。
    bDeviceProtocol:number; //指定设备使用的协议。值为 0 通常表示没有特定的协议
    bDeviceSubClass:number; // 是设备类别的子类别，进一步细化设备的类型。当 bDeviceClass 为 0 时，其具体含义由接口描述符决定。
    bLength:number; //表示设备描述符的长度，单位为字节。这里 bLength 为 18，说明该设备描述符的长度是 18 字节。
    bMaxPacketSize0:number; // 指控制端点 0 的最大数据包大小，单位为字节。端点 0 是每个 USB 设备都必须支持的控制端点，用于设备的配置和管理。这里 bMaxPacketSize0 为 64，表示控制端点 0 一次最多能传输 64 字节的数据
    bNumConfigurations:number; //表示设备支持的配置数量。USB 设备可以有多种配置方式，不同的配置可能对应不同的功能或性能。这里 bNumConfigurations 为 1，说明该设备只支持一种配置。
    bcdDevice:number; // 表示设备的版本号，采用二进制编码的十进制（BCD）格式。bcdDevice 为 512，转换为十六进制是 0x0200，通常表示设备版本为 2.0。
    bcdUSB:number; // 表示设备支持的 USB 规范版本，同样采用 BCD 格式。bcdUSB 为 512，即 0x0200，表示该设备支持 USB 2.0 规范。
    iManufacturer:number; // 是一个索引值，指向设备描述符字符串表中厂商名称的字符串描述符。通过该索引可以获取设备制造商的名称。
    iProduct:number; // 是一个索引值，指向设备描述符字符串表中产品名称的字符串描述符。通过该索引可以获取设备的产品名称。
    iSerialNumber:number; // 同样是索引值，指向设备描述符字符串表中设备序列号的字符串描述符，用于获取设备的唯一序列号。
    idProduct:number; // 是设备的产品 ID，由设备制造商分配，用于唯一标识该制造商生产的特定产品。idProduct 为 25610，转换为十六进制是 0x640A，不同的产品 ID 对应不同型号的设备。
    idVendor:number; // 是设备制造商的厂商 ID，由 USB Implementers Forum（USB-IF）分配给各个制造商。idVendor 为 1155，转换为十六进制是 0x0483，通过该 ID 可以识别设备的制造商。
  }; // 设备描述符
  portNumbers:number[]; // 表示设备连接到主机的端口编号数组。
}
export default function setupUsb(){

  ipcMain.handleOnce('open-usb-detect', async (_event) => {

    usb.on('attach', (device:usb.Device) => {
      _event.sender.send('usb-attach', { action: 'open', device });
    });
    usb.on('detach', (device:usb.Device) => {
      _event.sender.send('usb-detach', { action: 'open', device });
    });
  });

  ipcMain.handleOnce('close-usb-detect', async (_event) => {
    usb.removeAllListeners('attach');
    usb.removeAllListeners('detach');
  });

  // 获取usb设备列表 功能更强 
  ipcMain.handle('get-usb-devices', (_event) => {
    return getDeviceList()
  });
  // 获取串口通信设备列表 
  ipcMain.handle('get-ports-list', (_event) => {
    return SerialPort.list()
  });
  ipcMain.handle('create-serial-port', (_event, { path, baudRate }) => {
    return new SerialPort({ path, baudRate });
  });
}