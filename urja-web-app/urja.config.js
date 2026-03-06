
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    adapter: 'react-adapter',
    entry: ['src/main.tsx'],
    root: __dirname,
    outDir: 'dist',
    preset: 'spa',
    css: {
        framework: 'tailwind'
    },
    prebundle: {
        include: ['react', 'react-dom', 'react-dom/client', 'lucide-react']
    },
    plugins: [
        {
            name: 'website-plugin',
            manifest: {
                name: 'website-plugin',
                version: '1.0.0',
                engineVersion: '0.1.3',
                type: 'js',
                hooks: []
            },
            id: 'website-plugin',
            runHook: async (hook, input) => input
        }
    ]
};
