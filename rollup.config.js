import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import { readFileSync } from "node:fs";

const dev = process.env.ROLLUP_WATCH === "true";
const threeLicense = readFileSync(new URL("./node_modules/three/LICENSE", import.meta.url), "utf8");

export default {
  input: "src/melitta-barista-card.ts",
  output: {
    file: "dist/melitta-barista-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: true,
    banner: `/*! Bundled dependency: Three.js\n${threeLicense}\n*/`,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    json(),
    !dev &&
      terser({
        format: { comments: "some" },
      }),
  ],
  onwarn(warning, warn) {
    if (warning.code === "THIS_IS_UNDEFINED") return;
    warn(warning);
  },
};
