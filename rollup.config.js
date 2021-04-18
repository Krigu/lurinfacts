import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";
import { injectManifest } from "rollup-plugin-workbox";
import rollup_sizes from "rollup-plugin-sizes";
import rollup_analyze from "rollup-plugin-analyzer";
module.exports = [{
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    name: "app",
  },
  plugins: [
    svelte(),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: true,
      use: [
        [
          "sass",
          {
            includePaths: ["./src/theme", "./node_modules"],
          },
        ],
      ],
    }),
    rollup_sizes(),
    rollup_analyze({ limit: 10 }),
  ],
  watch: {
    clearScreen: false,
  },
},
{
  input: "src/sw/service-worker.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "workbox",
    file: "dist/service-worker.js",
  },
  plugins: [
    replace({
        preventAssignment: true,
       "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }),
    resolve(),
    injectManifest(
      {
        swSrc: "dist/service-worker.js",
        swDest: "dist/service-worker.js",
        globDirectory: "dist/",
      },
      function render({ swDest, count, size }) {
        console.log(`\nCustom render! ${swDest}`);
        console.log(
          `Custom render! The service worker will precache ${count} URLs, totaling ${size}.\n`
        );
      }
    ),
  ],
},
{
  input: "src/webworker/worker.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "webworker",
    file: "dist/worker.js",
  },
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }),
    resolve(),
  ],
},
];
