import { Config } from '@stencil/core';
const postcss = require('@stencil/postcss');
const autoprefixer = require('autoprefixer');
const sass = require('@stencil/sass');
const tailwindcss = require('tailwindcss');

export const config: Config = {
  namespace: 'mycomponent',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
