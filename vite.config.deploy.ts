import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Build específico para Vercel
export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html")
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['clsx', 'tailwind-merge']
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});