import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig({
  // cho phép thằng vite sử dụng được process.env, mặc định thì không mà sẽ phải dùng import.meta.env
  define: {
    "process.env": process.env,
  },
  plugins: [react(), svgr()],
  // base: './'
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
});
