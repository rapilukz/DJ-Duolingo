import './mocks/setupTests';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import ExtendedClient from '../src/client';
import { GatewayIntentBits } from 'discord.js';
import { afterEach } from 'node:test';

describe('ExtendedClient', () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let client: ExtendedClient;

	beforeEach(() => {
		vi.stubEnv('TOKEN', 'mocked token');
		vi.stubEnv('BOT_ID', 'mock-bot-id');
		vi.stubEnv('GUILD_ID', 'mock-guild-id');
		vi.stubEnv('SPOTIFY_CLIENT_ID', 'mock-spotify-id');
		vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'mock-spotify-secret');
		vi.stubEnv('FFMPEG_PATH', '/mock/path/to/ffmpeg');

		client = new ExtendedClient({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildIntegrations,
			],
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should login with the token', async () => {
		await client.init();
		expect(client.login).toHaveBeenCalledWith(process.env.TOKEN);
	});

	it('should register event handlers', async () => {
		vi.spyOn(client, 'EventHandler').mockResolvedValue();
		vi.spyOn(client, 'DistubeEventHandler').mockResolvedValue();
		vi.spyOn(client, 'SlashComamndHandler').mockResolvedValue();
		vi.spyOn(client, 'ButtonHandler').mockResolvedValue();

		await client.init();

		expect(client.EventHandler).toHaveBeenCalled();
		expect(client.DistubeEventHandler).toHaveBeenCalled();
		expect(client.SlashComamndHandler).toHaveBeenCalled();
		expect(client.ButtonHandler).toHaveBeenCalled();
	});

	// it('should handle missing YouTube cookies gracefully', () => {
	// 	vi.mock('fs', () => ({ readFileSync: vi.fn(() => { throw new Error('File not found'); }) }));
	// 	const cookies = client.getYtCookies();
	// 	expect(cookies).toEqual([]);
	// });
});