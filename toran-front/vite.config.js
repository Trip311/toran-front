import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@use "src/_variables.scss" as vars;`
    //     }
    //   }
    // },
    // server: {
    //   hmr: {
    //     overlay: false
    //   }
    // }
    server: {
    port: 3000,
    open: true
    }
});
