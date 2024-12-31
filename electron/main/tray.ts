import { app , Tray , nativeImage , Menu , BrowserWindow } from "electron";
import { join } from "path";
import { getMainWindow } from './index'

function loadMenu(tray:Tray){
  const rightMenu = Menu.buildFromTemplate([
    {
      label: '打开软件',
      type:'normal',
      click: () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: '打开设置',
      type:'normal',
      click: () => {
        console.log('打开设置---');

      }
    },
    {
      type:'separator',
    },
    {
      label: '退出',
      type:'normal',
      click: () => {
        app.exit();
      }
    },
  ]);
  tray.setContextMenu(rightMenu)
}
export function createTray(win:BrowserWindow){
  const mainWindow = getMainWindow();
  const tray = new Tray(nativeImage.createFromPath(join(process.cwd(), '/public/icon_rui.ico')));
  loadMenu(tray);
  tray.setToolTip('瑞普斯客户端');
  tray.on('click',(...arg)=>{
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  })
}
