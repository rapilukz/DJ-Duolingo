import { EmbedBuilder, Colors, CommandInteraction } from 'discord.js';
import { vi, afterEach, beforeEach } from 'vitest';
import { noMusicPlayingMockEmbed } from './discordMocks';

vi.mock('discord.js', async () => {
	const actual = await vi.importActual<typeof import('discord.js')>('discord.js');

	return {
		...actual,
		Client: class {
			on = vi.fn();
			login = vi.fn().mockResolvedValue('mocked token');
			user = {
				displayAvatarURL: vi.fn(),
			};
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
			getQueue = vi.fn();
			stop = vi.fn();
			jump = vi.fn();
			shuffle = vi.fn();
			seek = vi.fn();
			setRepeatMode = vi.fn();
			voices = {
				join: vi.fn(),
				leave: vi.fn(),
			};
		},
	};
});

vi.mock('../../src/utils/functions', async () => {
	const actual = await vi.importActual<typeof import('../../src/utils/functions')>('../../src/utils/functions');
	return {
		...actual,

		BaseErrorEmbed: vi.fn((description: string) => {
			return new EmbedBuilder()
				.setDescription(description)
				.setColor(Colors.Red)
				.setTimestamp();
		}),
		NoMusicPlayingEmbed: vi.fn((interaction: CommandInteraction) => {
			// Mock the actual embed that would be returned
			interaction.reply({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
		}),
	};
});

beforeEach(() => {
	vi.stubEnv('TOKEN', 'mocked token');
	vi.stubEnv('BOT_ID', 'mock-bot-id');
	vi.stubEnv('GUILD_ID', 'mock-guild-id');
	vi.stubEnv('SPOTIFY_CLIENT_ID', 'mock-spotify-id');
	vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'mock-spotify-secret');
	vi.stubEnv('FFMPEG_PATH', '/mock/path/to/ffmpeg');

	vi.useFakeTimers();
	vi.setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});