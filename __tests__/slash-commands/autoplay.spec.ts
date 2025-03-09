import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/autoplay';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction, noMusicPlayingMockEmbed, createMockQueue, MockQueueOptions } from '../mocks/discordMocks';
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
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);


		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalledWith(mockInteraction);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });

	});

	it('should set autoplay on if music is playing', async () => {
		mockQueueOptions.playing = true;
		mockQueueOptions.toggleAutoplay = true;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(mockQueue.toggleAutoplay).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith('Autoplay mode has been enabled');
	});

	it('should set autoplay off if music is playing and autoplay is on', async () => {
		mockQueueOptions.playing = true;
		mockQueueOptions.toggleAutoplay = false;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(mockQueue.toggleAutoplay).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith('Autoplay mode has been disabled');
	});
});