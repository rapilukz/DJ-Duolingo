import { it, expect, describe, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/leave';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockVoiceChannel } from '../mocks/discordMocks';

describe('Leave', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
	});

	const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('leave channel');
		expect(command.data.name).toBe('leave');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			permissions.toString(),
		);
	});

	it('should leave the voice channel', async () => {
		await command.run(mockInteraction, client);

		expect(client.distube.voices.leave).toHaveBeenCalledWith(mockInteraction.guildId);
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			`Left the voice channel! ${mockVoiceChannel}`,
		);
	});
});