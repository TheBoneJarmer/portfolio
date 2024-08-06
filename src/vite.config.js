import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        assetsDir: 'res',

        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                projects: resolve(__dirname, 'projects.html'),
                skills: resolve(__dirname, 'skills.html')
            },
        },
    },
})