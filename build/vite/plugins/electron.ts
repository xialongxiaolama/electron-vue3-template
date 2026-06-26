import createElectronPlugin from 'vite-plugin-electron/simple'
import fs from 'node:fs'
fs.rmSync('dist',{ recursive:true, force:true })
export const electronBuild = ( isBuild: boolean )=>{

 return createElectronPlugin({
    main:{
      entry:'src/main/main.ts',
      vite:{
        build: {
          sourcemap: !isBuild,
          minify: isBuild,
          outDir: 'dist/electron/main',
          rolldownOptions: {
            external:['usb','serialport','node-hid'],
          }
        },
      }
    },
    preload:{
      input: 'src/preload/index.ts',
      vite: {
        build: {
          sourcemap: true,
          minify: isBuild,
          outDir: 'dist/electron/preload'
        },
      },
    },
    renderer:{}
  })
}