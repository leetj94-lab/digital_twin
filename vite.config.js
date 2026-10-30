import {defineConfig} from 'vite';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:['terminal.local']},build:{rollupOptions:{input:'index.source.html',output:{manualChunks:{three:['three','three/addons/controls/OrbitControls.js','three/addons/loaders/GLTFLoader.js']}}}}});
