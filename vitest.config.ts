import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: 'DJ Duolingo',
		coverage: {
			provider: 'v8',
			reporter: ['cobertura', 'text'],
		},
		silent: true,
		outputFile: 'coverage/junit.xml',
		reporters: ['default', 'junit'],
		setupFiles: ['./__tests__/mocks/setupMocks.ts'],
		dir: path.resolve(__dirname, '__tests__'),
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
});
