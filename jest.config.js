/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],

  // Transformar JS/TS y archivos con babel-jest
   transform: {
    '^.+\\.(js|ts|tsx)$': ['babel-jest', { configFile: './babel.jest.js' }],
  },

  // Ignorar node_modules excepto los que queremos transformar
  transformIgnorePatterns: [
    "/node_modules/(?!(node-fetch-native-with-agent|node-appwrite)/)",
  ],

  // Alias y mocks de módulos
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mock__/svgMock.js",
  },

  // Configuración para inicializar jest
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Opcional: mostrar warnings de transformaciones
  verbose: true,
};
