import { Config } from "@stencil/core";
const { postcss } = require("@stencil/postcss");
const autoprefixer = require("autoprefixer");
const { stylus } = require("@stencil/stylus");
const tailwindcss = require("tailwindcss");

export const config: Config = {
  namespace: "poly-web",
  outputTargets: [
    { type: "dist" },
    { type: "docs" },
    {
      type: "www",
      serviceWorker: null // disable service workers
    }
  ],
  globalStyle: 'src/styles/global.styl',
  plugins: [
    stylus(),
    postcss({
      plugins: [
        autoprefixer(),
        tailwindcss("./config/tailwind.js")
      ]
    })
  ]
};
