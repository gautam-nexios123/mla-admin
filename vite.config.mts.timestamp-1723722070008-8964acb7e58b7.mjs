// vite.config.mts
import { defineConfig } from "file:///D:/Gautam/mla_watch_admin/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Gautam/mla_watch_admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgrPlugin from "file:///D:/Gautam/mla_watch_admin/node_modules/vite-plugin-svgr/dist/index.js";
import tsconfigPaths from "file:///D:/Gautam/mla_watch_admin/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react"
    }),
    tsconfigPaths({
      parseNative: false
    }),
    svgrPlugin(),
    {
      name: "custom-hmr-control",
      handleHotUpdate({ file, server }) {
        if (file.includes("src/app/configs/")) {
          server.ws.send({
            type: "full-reload"
          });
          return [];
        }
        return;
      }
    }
  ],
  build: {
    outDir: "build"
  },
  server: {
    open: true,
    port: 3e3
  },
  define: {
    global: "window"
  },
  resolve: {
    alias: {
      "@": "/src",
      "@fuse": "/src/@fuse",
      "@history": "/src/@history",
      "@lodash": "/src/@lodash",
      "@mock-api": "/src/@mock-api",
      "@schema": "/src/@schema",
      "app/store": "/src/app/store",
      "app/shared-components": "/src/app/shared-components",
      "app/configs": "/src/app/configs",
      "app/theme-layouts": "/src/app/theme-layouts",
      "app/AppContext": "/src/app/AppContext"
    }
  },
  "optimizeDeps": {
    "include": ["@mui/icons-material", "@mui/material", "@mui/base", "@mui/styles", "@mui/system", "@mui/utils", "@emotion/cache", "@emotion/react", "@emotion/styled", "lodash"],
    "exclude": [],
    "esbuildOptions": {
      "loader": {
        ".js": "jsx"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcR2F1dGFtXFxcXG1sYV93YXRjaF9hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcR2F1dGFtXFxcXG1sYV93YXRjaF9hZG1pblxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0dhdXRhbS9tbGFfd2F0Y2hfYWRtaW4vdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBzdmdyUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRwbHVnaW5zOiBbXHJcblx0XHRyZWFjdCh7XHJcblx0XHRcdGpzeEltcG9ydFNvdXJjZTogJ0BlbW90aW9uL3JlYWN0JyxcclxuXHRcdH0pLFxyXG5cdFx0dHNjb25maWdQYXRocyh7XHJcblx0XHRcdHBhcnNlTmF0aXZlOiBmYWxzZSxcclxuXHRcdH0pLFxyXG5cdFx0c3ZnclBsdWdpbigpLFxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOiAnY3VzdG9tLWhtci1jb250cm9sJyxcclxuXHRcdFx0aGFuZGxlSG90VXBkYXRlKHsgZmlsZSwgc2VydmVyIH0pIHtcclxuXHRcdFx0XHRpZiAoZmlsZS5pbmNsdWRlcygnc3JjL2FwcC9jb25maWdzLycpKSB7XHJcblx0XHRcdFx0XHRzZXJ2ZXIud3Muc2VuZCh7XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmdWxsLXJlbG9hZCcsXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHJldHVybiBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHRdLFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRvdXREaXI6ICdidWlsZCcsXHJcblx0fSxcclxuXHRzZXJ2ZXI6IHtcclxuXHRcdG9wZW46IHRydWUsXHJcblx0XHRob3N0IDogXCIxOTIuMTY4LjI5LjhcIixcclxuXHRcdHBvcnQ6IDMwMDBcclxuXHR9LFxyXG5cdGRlZmluZTp7XHJcblx0XHRnbG9iYWw6ICd3aW5kb3cnLFxyXG5cdH0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0YWxpYXM6IHtcclxuXHRcdFx0J0AnOiAnL3NyYycsXHJcblx0XHRcdFwiQGZ1c2VcIjogXCIvc3JjL0BmdXNlXCIsXHJcblx0XHRcdFwiQGhpc3RvcnlcIjogXCIvc3JjL0BoaXN0b3J5XCIsXHJcblx0XHRcdFwiQGxvZGFzaFwiOiBcIi9zcmMvQGxvZGFzaFwiLFxyXG5cdFx0XHRcIkBtb2NrLWFwaVwiOiBcIi9zcmMvQG1vY2stYXBpXCIsXHJcblx0XHRcdFwiQHNjaGVtYVwiOiBcIi9zcmMvQHNjaGVtYVwiLFxyXG5cdFx0XHRcImFwcC9zdG9yZVwiOiBcIi9zcmMvYXBwL3N0b3JlXCIsXHJcblx0XHRcdFwiYXBwL3NoYXJlZC1jb21wb25lbnRzXCI6IFwiL3NyYy9hcHAvc2hhcmVkLWNvbXBvbmVudHNcIixcclxuXHRcdFx0XCJhcHAvY29uZmlnc1wiOiBcIi9zcmMvYXBwL2NvbmZpZ3NcIixcclxuXHRcdFx0XCJhcHAvdGhlbWUtbGF5b3V0c1wiOiBcIi9zcmMvYXBwL3RoZW1lLWxheW91dHNcIixcclxuXHRcdFx0XCJhcHAvQXBwQ29udGV4dFwiOiBcIi9zcmMvYXBwL0FwcENvbnRleHRcIlxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdFwib3B0aW1pemVEZXBzXCI6IHtcclxuXHRcdFwiaW5jbHVkZVwiOiBbJ0BtdWkvaWNvbnMtbWF0ZXJpYWwnLCdAbXVpL21hdGVyaWFsJywnQG11aS9iYXNlJywnQG11aS9zdHlsZXMnLCdAbXVpL3N5c3RlbScsJ0BtdWkvdXRpbHMnLCdAZW1vdGlvbi9jYWNoZScsJ0BlbW90aW9uL3JlYWN0JywnQGVtb3Rpb24vc3R5bGVkJywnbG9kYXNoJ10sXHJcblx0XHRcImV4Y2x1ZGVcIjogW10sXHJcblx0XHRcImVzYnVpbGRPcHRpb25zXCI6IHtcclxuXHRcdFx0XCJsb2FkZXJcIjoge1xyXG5cdFx0XHRcdFwiLmpzXCI6IFwianN4XCIsXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVEsU0FBUyxvQkFBb0I7QUFDbFMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBRzFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLE1BQU07QUFBQSxNQUNMLGlCQUFpQjtBQUFBLElBQ2xCLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxNQUNiLGFBQWE7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYO0FBQUEsTUFDQyxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsRUFBRSxNQUFNLE9BQU8sR0FBRztBQUNqQyxZQUFJLEtBQUssU0FBUyxrQkFBa0IsR0FBRztBQUN0QyxpQkFBTyxHQUFHLEtBQUs7QUFBQSxZQUNkLE1BQU07QUFBQSxVQUNQLENBQUM7QUFDRCxpQkFBTyxDQUFDO0FBQUEsUUFDVDtBQUNBO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBLFFBQU87QUFBQSxJQUNOLFFBQVE7QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxZQUFZO0FBQUEsTUFDWixXQUFXO0FBQUEsTUFDWCxhQUFhO0FBQUEsTUFDYixXQUFXO0FBQUEsTUFDWCxhQUFhO0FBQUEsTUFDYix5QkFBeUI7QUFBQSxNQUN6QixlQUFlO0FBQUEsTUFDZixxQkFBcUI7QUFBQSxNQUNyQixrQkFBa0I7QUFBQSxJQUNuQjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLGdCQUFnQjtBQUFBLElBQ2YsV0FBVyxDQUFDLHVCQUFzQixpQkFBZ0IsYUFBWSxlQUFjLGVBQWMsY0FBYSxrQkFBaUIsa0JBQWlCLG1CQUFrQixRQUFRO0FBQUEsSUFDbkssV0FBVyxDQUFDO0FBQUEsSUFDWixrQkFBa0I7QUFBQSxNQUNqQixVQUFVO0FBQUEsUUFDVCxPQUFPO0FBQUEsTUFDUjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
