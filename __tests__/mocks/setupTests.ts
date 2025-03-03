import { vi } from 'vitest';

vi.mock('discord.js', async () => {
	const actual = await vi.importActual<typeof import('discord.js')>('discord.js');

	return {
		...actual,
		Client: class {
			on = vi.fn();
			login = vi.fn().mockResolvedValue('mocked token');
		},
		Collection: class {
			set = vi.fn();
			get = vi.fn();
		},
	};
});

vi.mock('distube', async () => {
	const actual = await vi.importActual<typeof import('distube')>('distube');

	return {
		...actual,
		DisTube: class {
			on = vi.fn();
		},
	};
});