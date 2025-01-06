import { defineStore } from 'pinia'
import { theme } from './types'

const useThemeStore = defineStore(
  'theme',
  {
    state: (): theme => ({
      theme: 'light',
      asideBg: '#fff',
      headerBg: '#fff',
      mainBg: '#f8f8f8',
      // icon 配置
      iconSize: '32px',
      iconColor: '#333',
    }),
    actions: {
      changeTheme(theme: 'light' | 'dark') {
        this.theme = theme
      },
      updateSetting(partial: Partial<theme>) {
        this.$patch(partial)
      },
    },
    persist: {
      key: 'theme',
      storage: localStorage,
      paths: ['theme'],
    }
  }
)
export default useThemeStore
