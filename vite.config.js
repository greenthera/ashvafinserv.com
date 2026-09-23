import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Staging is served under this subpath (http://greenthera.shivantra.com/ashvafinserv.com/).
  // Change this back to '/' once the site moves to the ashvafinserv.com domain root.
  base: '/ashvafinserv.com/',
});
