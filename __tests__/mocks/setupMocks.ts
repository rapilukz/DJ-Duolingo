import { vi, afterEach, beforeEach } from 'vitest';

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
			get = vi.fn(() => []);
		},
	};
});

vi.mock('fs', async () => {
	const actual = await vi.importActual<typeof import('fs')>('fs');

	return {
		...actual,
		readFileSync: vi.fn(),
		readdirSync: vi.fn(() => []),
	};
});

vi.mock('distube', async () => {
	const actual = await vi.importActual<typeof import('distube')>('distube');

	return {
		...actual,
		DisTube: class {
			on = vi.fn();
			getQueue = vi.fn().mockReturnValue(undefined);
			voices = {
				join: vi.fn(),
				leave: vi.fn(),
			};
		},
	};
});

beforeEach(() => {
	vi.stubEnv('TOKEN', 'mocked token');
	vi.stubEnv('BOT_ID', 'mock-bot-id');
	vi.stubEnv('GUILD_ID', 'mock-guild-id');
	vi.stubEnv('SPOTIFY_CLIENT_ID', 'mock-spotify-id');
	vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'mock-spotify-secret');
	vi.stubEnv('FFMPEG_PATH', '/mock/path/to/ffmpeg');
});

afterEach(() => {
	vi.restoreAllMocks();
});