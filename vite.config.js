import {defineConfig} from 'vite';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:['terminal.local']},build:{rollupOptions:{output:{manualChunks:{three:['three','three/addons/controls/OrbitControls.js','three/addons/loaders/GLTFLoader.js']}}}}});
