import { defineStore } from 'pinia'
import { layout , asideType } from './types'
 const useLayoutStore = defineStore('layout', {
  state: ():layout => ({
    asideDisplay: 'left',
    headerDisplay: true,
    footerDisplay: false,
    isFullScreen: false,
  }),
  persist: {
    key: 'layout',
    storage: localStorage,
    paths:['layout']
  },
  actions: {
    setAsidePosition(position: asideType) {
      this.asidePosition = position
    }
  }
})

export default useLayoutStore