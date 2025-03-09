import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/autoplay';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, mockMember, noMusicPlayingMockEmbed, createMockQueue, MockQueueOptions } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Autoplay', () => {
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

	const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('Set the autoplay mode');
		expect(command.data.name).toBe('autoplay');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			permissions.toString(),
		);
	});

	it('should not set autoplay if no music is playing', async () => {
		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);


		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalledWith(interaction);
		expect(interaction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });

	});

	it('should set autoplay on if music is playing', async () => {
		mockQueueOptions.playing = true;
		mockQueueOptions.toggleAutoplay = true;

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);

		expect(mockQueue.toggleAutoplay).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith('Autoplay mode has been enabled');
	});

	it('should set autoplay off if music is playing and autoplay is on', async () => {
		mockQueueOptions.playing = true;
		mockQueueOptions.toggleAutoplay = false;

		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(interaction, client);

		expect(mockQueue.toggleAutoplay).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith('Autoplay mode has been disabled');
	});
});