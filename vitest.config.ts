import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['cobertura', 'text'],
		},
		outputFile: 'coverage/junit.xml',
		reporters: ['default', 'junit'],
		setupFiles: ['./__tests__/mocks/setupMocks.ts'],
	},
});
