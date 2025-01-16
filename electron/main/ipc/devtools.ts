import { ipcMain } from "electron";
import { ChildProcessWithoutNullStreams , spawn } from 'child_process'
import { mainWindow } from '../index.ts'
import treeKill from 'tree-kill'
class VueDevTools{
  private static instance:VueDevTools;
  private vueDevToolsProcess: ChildProcessWithoutNullStreams|null = null;

  private constructor(){}
  public static getInstance(){
    if (!VueDevTools.instance) {
      VueDevTools.instance = new VueDevTools()
    }
    return VueDevTools.instance
  }
  openDevTools(){
    console.log(this.vueDevToolsProcess);
    if (this.vueDevToolsProcess) {
      console.log('Vue DevTools is already running.');
      return mainWindow.webContents.send('devtools-open-success')
    }
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    this.vueDevToolsProcess = spawn(npmCommand, ['run', 'vue-tools'], {
      cwd: process.cwd(), // 设置命令运行目录
      shell: true, // 确保可以在 shell 中执行
    });
    this.vueDevToolsProcess.stdout.on('data', (data) => {
      if (data.toString().includes('listening on')) {
        mainWindow.webContents.send('devtools-open-success', data.toString());
      }
    });

    this.vueDevToolsProcess.on('close', (code) => {
      console.log(`Vue DevTools process exited with code ${code}`);
      this.vueDevToolsProcess = null;
      mainWindow.webContents.send('devtools-closed');
    });
  }
  closeDevTools(){
    if (this.vueDevToolsProcess) {
      if (this.vueDevToolsProcess && this.vueDevToolsProcess.pid !== undefined) {
        treeKill(this.vueDevToolsProcess.pid, 'SIGTERM', (err:any) => {
          if (err) {
            console.error('Failed to kill process:', err);
          } else {
            console.log('Process killed successfully');
          }
        });
      }
    }
  }
}
export const vueDevTools = VueDevTools.getInstance()

export default function setupDevtools(){
  ipcMain.on('open-devtools',()=>{
    vueDevTools.openDevTools()
  })
  ipcMain.on('close-devtools',()=>{
    vueDevTools.closeDevTools()
  })
}