import { defineStore } from 'pinia'


const useShortcutsStore = defineStore('shortcuts',{
  state:()=>({
    shortcuts:{
      openDevtools: 'ctrl+shift+i',
      quit: 'ctrl+shift+q',
      hide: 'ctrl+d'
    }
  }),
  persist:{
    key: 'shortcuts',
    storage: localStorage,
    paths:['shortcuts']
  },
  actions:{
    setShortcut(action:string,key:string){
      this.shortcuts[action] = key
    }
  }
  
})

export default useShortcutsStore