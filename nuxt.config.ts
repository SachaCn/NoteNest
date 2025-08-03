// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/mains.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@prisma/nuxt"],
});
