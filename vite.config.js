// vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   base: '/EcommerceAdmin/',
//   plugins: [react()]
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://graphytune.com",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path,
  //     },
  //   },
  // },
});
