import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/autoplay';
import { CommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockMember, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';
import { Queue } from 'distube';

describe('Autoplay', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
		vi.clearAllMocks();
	});

	const premmisions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('Set the autoplay mode');
		expect(command.data.name).toBe('autoplay');
		expect(command.data.default_member_permissions).toBe(
			premmisions.toString(),
		);
	});

	it('should not set autoplay if user is not inside a channel', async () => {
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

	it('should not set autoplay if no music is playing', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(true);

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = {
			playing: false,
		} as Queue;

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);


		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalledWith(interaction);
		expect(interaction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });

	});

	it('should set autoplay on if music is playing', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(true);

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = {
			playing: true,
			toggleAutoplay: vi.fn().mockReturnValue(true),
		} as unknown as Queue;

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);

		expect(mockQueue.toggleAutoplay).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith('Autoplay mode has been enabled');
	});

	it('should set autoplay off if music is playing and autoplay is on', async () => {
		vi.spyOn(utils, 'isVoiceChannel').mockReturnValue(true);

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = {
			playing: true,
			toggleAutoplay: vi.fn().mockReturnValue(false),
		} as unknown as Queue;

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);

		expect(mockQueue.toggleAutoplay).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith('Autoplay mode has been disabled');
	});
});