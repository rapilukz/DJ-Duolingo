import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/replay';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Replay', () => {
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
		expect(command.description).toBe('Replays the current song');
		expect(command.data.name).toBe('replay');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
		expect(command.data.options).toHaveLength(0);
	});

	it('should not rewind if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should rewind the song', async () => {
		mockQueueOptions.playing = true;

		const queue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(queue);

		await command.run(mockInteraction, client);
		const expectedSong = queue.songs[0];

		expect(client.distube.seek).toHaveBeenCalledWith(mockInteraction.guildId, 0);
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [utils.BaseSuccessEmbed(`Replaying: [${expectedSong.name}](${expectedSong.url}) from the beginning`)],
		});
	});
});
