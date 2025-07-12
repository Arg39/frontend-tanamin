module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // Transpile node_modules except for those that need it (like axios)
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)', // tambahkan package lain jika perlu
  ],
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
