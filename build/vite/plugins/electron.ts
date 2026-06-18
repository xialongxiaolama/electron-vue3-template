import createElectronPlugin from 'vite-plugin-electron/simple'
import fs from 'node:fs'
fs.rmSync('dist',{ recursive:true, force:true })
export const electronBuild = ( isBuild: boolean )=>{

 return createElectronPlugin({
    main:{
      entry:'src/main/main.ts',
      vite:{
        build: {
          minify: isBuild,
          outDir: 'dist/electron/main',
          rollupOptions: {
            external:['usb','SerialPort','node-hid'],
          }
        },
      }
    },
    preload:{
      input: 'src/preload/index.ts',
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