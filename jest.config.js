/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  rootDir: ".",
  testEnvironment: "jsdom",

  testMatch: [
    "**/?(*.)+(test|spec).(ts|tsx|js|jsx)",
  ],

  transform: {
    '^.+\\.(js|ts|tsx)$': ['babel-jest', { configFile: './babel.jest.js' }],
  },

  transformIgnorePatterns: [
    "/node_modules/(?!(node-fetch-native-with-agent|node-appwrite)/)",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mock__/svgMock.js",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  verbose: true,
};
