import { Menu } from 'electron'
export function createMenu(menuConfig:Electron.Menu){
  Menu.setApplicationMenu(menuConfig)
}