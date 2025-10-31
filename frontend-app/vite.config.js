import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss()],
	server: {
		// proxy: {
		// 	'/users': {
		// 		target: 'http://localhost:8080',
		// 		changeOrigin: true,
		// 		secure: false,
		// 	},
		// },
	},
});
