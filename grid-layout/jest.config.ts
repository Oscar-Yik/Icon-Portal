import type { Config } from 'jest';

const config : Config = {
  coverageProvider: "v8",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleFileExtensions: ["ts", "js"],
  roots: ["./src"],
};

export default config;