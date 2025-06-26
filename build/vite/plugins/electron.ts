import createElectronPlugin from 'vite-plugin-electron/simple'
import fs from 'node:fs'
fs.rmSync('dist',{ recursive:true, force:true })
export const electronBuild = ( isBuild: boolean )=>{

 return createElectronPlugin({
    main:{
      entry:'electron/main/index.ts',
      vite:{
        build: {
          minify: isBuild,
          outDir: 'dist/electron/main',
          rollupOptions: {
            external:['usb','serialport','node-hid'],
          }
        },
      }
    },
    preload:{
      input: 'electron/preload/index.ts',
      vite: {
        build: {
          sourcemap: 'inline',
          minify: isBuild,
          outDir: 'dist/electron/preload'
        },
      },
    },
    renderer:{}
  })
}