import { it, expect, describe, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import ExtendedClient from '@/client';

describe('ExtendedClient', () => {
	let client: ExtendedClient;

	beforeEach(async () => {
		client = new ExtendedClient({ intents: [] });
	});

	it('should login with the token', async () => {
		await client.init();
		expect(client.login).toHaveBeenCalledWith(process.env.TOKEN);
	});

	it('should register event handlers', async () => {
		vi.spyOn(client, 'EventHandler').mockResolvedValue();
		vi.spyOn(client, 'DistubeEventHandler').mockResolvedValue();
		vi.spyOn(client, 'SlashCommandHandler').mockResolvedValue();
		vi.spyOn(client, 'ButtonHandler').mockResolvedValue();

		await client.init();

		expect(client.EventHandler).toHaveBeenCalled();
		expect(client.DistubeEventHandler).toHaveBeenCalled();
		expect(client.SlashCommandHandler).toHaveBeenCalled();
		expect(client.ButtonHandler).toHaveBeenCalled();
	});

	it('should return parsed cookies when yt-cookies.json exists', () => {
		const mockCookies = [{ name: 'LOGIN_INFO', value: 'some_value' }];
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockCookies));

		const cookies = client.getYtCookies();
		expect(cookies).toEqual(mockCookies);
	});

	it('should return an empty array when yt-cookies.json is missing', () => {
		vi.mocked(readFileSync).mockImplementation(() => {
			throw new Error('File not found');
		});

		const cookies = client.getYtCookies();
		expect(cookies).toEqual([]);
	});

	it('should return an empty array when yt-cookies.json is corrupted/badly formated', () => {
		vi.mocked(readFileSync).mockReturnValue('invalid json');

		const cookies = client.getYtCookies();
		expect(cookies).toEqual([]);
	});

	it('should handle empty slash command directories correctly', async () => {
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify([]));

		await client.readSlashCommandsFromFiles();
		expect(client.SlashCommands.size).toBe(undefined);
		expect(client.SlashCommandsArray.length).toBe(0);
	});

	it('should handle errors in SlashComamndHandler', async () => {
		vi.spyOn(client, 'readSlashCommandsFromFiles').mockRejectedValue('Failed to load commands');
		const consoleSpy = vi.spyOn(console, 'log');

		await client.SlashCommandHandler();
		expect(consoleSpy).toHaveBeenCalledWith('Failed to load commands');
	});
});