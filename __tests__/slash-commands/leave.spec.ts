import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/leave';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockMember, mockVoiceChannel } from '../mocks/discordMocks';

describe('Leave', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
		vi.clearAllMocks();
	});

	const premmisions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('leave channel');
		expect(command.data.name).toBe('leave');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			premmisions.toString(),
		);
	});

	it('should leave the voice channel', async () => {
		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		await command.run(interaction, client);

		expect(client.distube.voices.leave).toHaveBeenCalledWith(interaction.guildId);
		expect(interaction.reply).toHaveBeenCalledWith(
			`Left the voice channel! ${mockVoiceChannel}`,
		);
	});
});