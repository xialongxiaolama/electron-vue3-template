import { ipcRenderer , contextBridge } from 'electron'

console.log('preload.js loaded successfully');

// 通过预加载脚本 向渲染进程中暴露主线程中的方法
// webPreferences 中 contextIsolation 默认为true 隔离了
contextBridge.exposeInMainWorld('ipcRenderer',{
  on(...args:Parameters<typeof ipcRenderer.on>){
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  once(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.once(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  removeAllListeners(channel:string){
    return ipcRenderer.removeAllListeners(channel)
  }
})
contextBridge.exposeInMainWorld('process',{
  argv: process.argv,
  env: process.env,
})

// 添加加载等待动画
function domReady(condition:DocumentReadyState[] = ['complete','interactive']){
  return new Promise(resolve=>{
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent:HTMLElement, child:HTMLElement) {
    if (parent && child) {
      parent.appendChild(child)
    }
  },
  remove(node:HTMLElement) {
    if (node) {
      node.parentNode?.removeChild(node)
    }
  },
}



function useLoading() {
  const className = `loader`
  const styleContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .${className} {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  }
  .app-loading-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
  }
  `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(oStyle)
      safeDOM.remove(oDiv)
    },
  }
}

const { appendLoading , removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)