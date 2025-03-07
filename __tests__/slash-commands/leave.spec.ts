import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/leave';
import { CommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockMember, mockVoiceChannel } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

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
		expect(command.data.default_member_permissions).toBe(
			premmisions.toString(),
		);
	});

	it('should leave the voice channel', async () => {
		vi.mock('../../src/utils/functions', () => ({
			isVoiceChannel: vi.fn(() => true),
		}));

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

	it('should not leave if user is not inside a channel', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(false);

		const member = {
			voice: {},
		} as unknown as GuildMember;

		const interaction = {
			...mockInteraction,
			member: member,
		} as CommandInteraction;

		await command.run(interaction, client);

		expect(interaction.reply).toHaveBeenCalledWith(
			'You need to be in a voice channel to use this command!',
		);
		expect(client.distube.voices.leave).not.toHaveBeenCalled();
	});
});