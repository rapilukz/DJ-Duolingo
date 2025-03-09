import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/join';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockMember, mockVoiceChannel } from '../mocks/discordMocks';

describe('Join', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
		vi.clearAllMocks();
	});

	const premmisions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('join channel');
		expect(command.data.name).toBe('join');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			premmisions.toString(),
		);
	});

	it('should join the voice channel', async () => {
		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		await command.run(interaction, client);

		expect(client.distube.voices.join).toHaveBeenCalledWith(mockVoiceChannel);
		expect(interaction.reply).toHaveBeenCalledWith(
			`Joined the voice channel! ${mockVoiceChannel}`,
		);
	});
});