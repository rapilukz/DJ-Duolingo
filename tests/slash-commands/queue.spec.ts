import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/queue';
import { Colors, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';
import { EmbedBuilder } from '@discordjs/builders';

describe('Queue', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
	});

	it('should have the correct command data', () => {
		const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

		expect(command.category).toBe('Music');
		expect(command.description).toBe('See the current queue');
		expect(command.data.name).toBe('queue');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
	});

	it('should not show the queue if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should show the queue if there is a queue', async () => {
		const mockQueueOptions: MockQueueOptions = {
			playing: true,
			toggleAutoplay: false,
			paused: false,
		};

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		const expectedDescription = mockQueue.songs.map((song, i) => {
			return `${i === 0 ? '**Playing:**' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
		}).join('\n');

		expect(mockInteraction.reply).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [new EmbedBuilder()
				.setTitle('🎶 Current Queue')
				.setDescription(expectedDescription)
				.setColor(Colors.Green)
				.setTimestamp(),
			],
		});
	});
});