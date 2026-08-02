import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/instagram-follow-analyzer/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Instagram Follow Analyzer",
        short_name: "Follow Analyzer",
        description:
          "Analizza follower, following e richieste Instagram direttamente dal dispositivo",

        theme_color: "#000000",
        background_color: "#ffffff",

        display: "standalone",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});