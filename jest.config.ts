import type { Config } from "@jest/types";

/**
 * Configuration options for Jest testing framework.
 * Defines preset, test environment, roots, test matchers,
 * module file extensions, and TypeScript-specific options.
 */
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json", // Path to your TypeScript config file
    },
  },
};

export default config;


{
  "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "outDir": "./dist",
      "strict": true
  },
  "include": [
      "src/**/*.ts"
  ],
  "exclude": [
      "node_modules"
  ]
}

