import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ["lib"],
    }),
  ],
  build: {
    lib: {
      entry: "lib/main.ts",
      name: "formite",
      fileName: "formite",
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled
      external: ["react"],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: "React",
        },
      },
    },
  },
});
