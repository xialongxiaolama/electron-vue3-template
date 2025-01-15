import { ipcMain } from "electron";
import { spawn } from 'child_process'
import { mainWindow } from '../index.ts'
export default function setupDevtools(){
  ipcMain.on('open-devtool',(event,data)=>{

    const vueDevTools = spawn('npm', ['run', 'vue-tools'],{
      cwd: process.cwd(), // 设置命令运行目录
      shell: true, // 确保可以在 shell 中执行
    })

    vueDevTools.stdout.on('data', (data) => {
      if (data.toString().includes('listening on')) {
        console.log('devtools-open-success', data.toString());

         // 窗口加载完成事件
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
          mainWindow.webContents.send('devtools-open-success', data.toString())
        })
      }
    });

    vueDevTools.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

  })
}