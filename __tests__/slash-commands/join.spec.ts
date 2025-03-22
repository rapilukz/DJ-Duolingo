import { it, expect, describe, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/join';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockVoiceChannel } from '../mocks/discordMocks';

describe('Join', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
	});

	const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('join channel');
		expect(command.data.name).toBe('join');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			permissions.toString(),
		);
	});

	it('should join the voice channel', async () => {
		await command.run(mockInteraction, client);

		expect(client.distube.voices.join).toHaveBeenCalledWith(mockVoiceChannel);
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			`Joined the voice channel! ${mockVoiceChannel}`,
		);
	});
});