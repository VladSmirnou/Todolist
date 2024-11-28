export default {
    // js files import support:
    preset: 'ts-jest/presets/js-with-ts',
    // --------------------------
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // js files import support:
        'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
        // --------------------
    },
    // js files import support:
    transformIgnorePatterns: ['node_modules/(?!troublesome-dependency/.*)'],
    // ----------------------
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^.+\\.svg$': 'jest-transformer-svg',
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
