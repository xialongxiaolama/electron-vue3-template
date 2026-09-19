import { ipcMain } from "electron";
import { SerialPort } from 'serialport';
import { HID , devices } from 'node-hid'
import { usb , getDeviceList } from "usb";

// handle 监听 ipcRenderer.invoke 事件
// handleOnce 监听 ipcRenderer.invoke 事件,只监听一次

// on  监听 ipcRenderer.send 事件
// once  监听 ipcRenderer.send 事件,只监听一次

// 区别 : send 仅用来发送信息 ,on仅监听信息
//       invoke 发送信息,并接收返回的信息(可以返回Promise异步), handle监听信息,并返回指定内容

export default function setupUsb(){
  let isFirst = true
  ipcMain.handle('usb:openDetect', async (_event) => {
      if (isFirst) {
        usb.on('attach', (device:usb.Device) => {
          _event.sender.send('usb:attach', { action: 'open', device });
        });
        usb.on('detach', (device:usb.Device) => {
          _event.sender.send('usb:detach', { action: 'open', device });
        });
        isFirst = false
      }
  });

  ipcMain.handleOnce('usb:closeDetect', async (_event) => {
    usb.removeAllListeners('attach');
    usb.removeAllListeners('detach');
  });

  // 获取usb设备列表 功能更强 
  ipcMain.handle('usb:getList', (_event) => {
    return getDeviceList()
  });
  // 获取hid设备列表 功能更强 
  ipcMain.handle('hid:getList', (_event) => {
    return devices()
  });
  
  const hidDeviceCacheMap = new Map<string,HID>()
  
  ipcMain.handle('hid:openDevice',(_event,vid ,pid,channel)=>{
    try {
      let hidDevice = hidDeviceCacheMap.get(channel)
      if (!hidDevice) {
        hidDevice = new HID(vid,pid);
        hidDeviceCacheMap.set(channel,hidDevice)
        console.log(`output->deviceInit`)
        // 监听 HID 设备数据
        hidDevice.on('data', (data) => {
            _event.sender.send(`hid:data:${channel}`, data); // 转发到渲染进程
        });
    
        hidDevice.on('error', (err) => {
          console.error('HID error:', err);
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error };
    }
  })
  ipcMain.handle('hid:sendData',(_event,data:number[],channel)=>{
    try {
      let hidDevice = hidDeviceCacheMap.get(channel)
      if (!hidDevice) {
        return { success: false, error: `通讯通道不存在${channel}` }
      }
      hidDevice.write(data)
      return { success: true };
    } catch (error) {
      return { success: false, error: error };
    }
  })

  // 获取串口通信设备列表 
  ipcMain.handle('port:getList', (_event) => {
    return SerialPort.list()
  });
  ipcMain.handle('port:createPort', (_event, { path, baudRate }) => {
    return new SerialPort({ path, baudRate });
  });
}