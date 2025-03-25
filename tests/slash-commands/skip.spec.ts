import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/skip';
import { Colors, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';
import { EmbedBuilder } from '@discordjs/builders';

describe('Skip', () => {
	let client: ExtendedClient;
	let mockQueueOptions: MockQueueOptions;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });

		mockQueueOptions = {
			playing: false,
			toggleAutoplay: false,
			paused: false,
		};
	});

	it('should have the correct command data', () => {
		const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

		expect(command.category).toBe('Music');
		expect(command.description).toBe('Skip the current song');
		expect(command.data.name).toBe('skip');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
	});


	it('should not skip if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should not skip if there is queue but playing is false', async () => {
		mockQueueOptions.playing = false;
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
		expect(mockQueue.distube.skip).not.toHaveBeenCalled();
	});

	it('should not skip if there is no next song', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockQueue.songs.pop();

		await command.run(mockInteraction, client);

		expect(mockQueue.songs[1]).toBeUndefined();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [new EmbedBuilder()
				.setDescription('There is no next song to skip to!')
				.setColor(Colors.Red),
			],
		});
		expect(mockQueue.distube.skip).not.toHaveBeenCalled();
	});

	it('should skip the music if there is a next song', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(mockQueue.songs[1]).toBeDefined();
		expect(mockQueue.distube.skip).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [new EmbedBuilder()
				.setDescription('The music has been skipped!')
				.setColor(Colors.Green),
			],
		});
	});
});
