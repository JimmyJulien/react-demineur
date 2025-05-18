/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { coverageConfigDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ["src/**/*.spec.{ts,tsx}"],
    environment: "happy-dom",
    coverage: {
      include: ["src"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/main.tsx",
        "**/*.model.ts",
      ],
    },
  },
});
