import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const dev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/melitta-barista-card.ts",
  output: {
    file: "dist/melitta-barista-card.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    json(),
    !dev &&
      terser({
        format: { comments: false },
      }),
  ],
  onwarn(warning, warn) {
    if (warning.code === "THIS_IS_UNDEFINED") return;
    warn(warning);
  },
};
