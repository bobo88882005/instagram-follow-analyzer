import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";


export default defineConfig({

  // IMPORTANTE per GitHub Pages
  base: "/instagram-follow-analyzer/",


  plugins: [

    react(),


    VitePWA({

      registerType: "autoUpdate",


      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png"
      ],


      manifest: {

        name:
          "Instagram Follow Analyzer",


        short_name:
          "Follow Analyzer",


        description:
          "Analizza follower, following e richieste Instagram direttamente dal dispositivo.",


        theme_color:
          "#000000",


        background_color:
          "#ffffff",


        display:
          "standalone",


        orientation:
          "portrait",


        start_url:
          "/instagram-follow-analyzer/",


        icons: [

          {
            src:
              "/instagram-follow-analyzer/icons/icon-192.png",

            sizes:
              "192x192",

            type:
              "image/png"
          },


          {
            src:
              "/instagram-follow-analyzer/icons/icon-512.png",

            sizes:
              "512x512",

            type:
              "image/png"
          }

        ]

      }

    })

  ]

});
