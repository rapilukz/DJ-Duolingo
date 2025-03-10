import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/shuffle';
import { Colors, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';
import { EmbedBuilder } from '@discordjs/builders';

describe('Shuffle', () => {
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

	it('should have the correct command data', () => {
		const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

		expect(command.category).toBe('Music');
		expect(command.description).toBe('Shuffles the queue');
		expect(command.data.name).toBe('shuffle');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
	});

	it('should not shuffle if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
		expect(client.distube.shuffle).not.toHaveBeenCalled();
	});

	it('should shuffle if there is a queue', async () => {
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		client.distube.shuffle = vi.fn().mockResolvedValue(mockQueue);

		await command.run(mockInteraction, client);

		const expectedDescription = mockQueue.songs.map((song, i) => {
			return `${i === 0 ? '**Playing:**' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
		}).join('\n');

		expect(mockInteraction.reply).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [new EmbedBuilder()
				.setTitle('🎶 Queue Shuffled')
				.setDescription(expectedDescription)
				.setColor(Colors.Green)
				.setTimestamp(),
			],
		});
		expect(client.distube.shuffle).toBeCalledWith(mockInteraction.guildId);

	});
});