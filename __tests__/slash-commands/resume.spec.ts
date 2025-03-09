import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/resume';
import { CommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, MockQueueOptions, mockMember, noMusicPlayingMockEmbed, createMockQueue } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('resume', () => {
	let client: ExtendedClient;
	let mockQueueOptions: MockQueueOptions;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
		mockQueueOptions = {
			playing: false,
			toggleAutoplay: false,
			paused: false,
		};

		vi.clearAllMocks();
	});

	const premmisions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('resumes the music');
		expect(command.data.name).toBe('resume');
		expect(command.data.default_member_permissions).toBe(
			premmisions.toString(),
		);
	});

	it('should not resume if user is not inside a channel', async () => {
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
	});

	it('should not resume if there is no queue', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(true);

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(interaction, client);

		expect(interaction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should resume the music if it is paused', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(true);

		mockQueueOptions.paused = true;

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);

		expect(mockQueue.resume).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseSuccessEmbed('You hit the resume button, the music is now playing!')] });
	});

	it('should not resume the music if it is already playing', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(true);

		mockQueueOptions.playing = true;

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);

		expect(interaction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseErrorEmbed('The music is already playing!')] });
	});
});