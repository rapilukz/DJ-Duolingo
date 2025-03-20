import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/back';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Back', () => {
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
		expect(command.description).toBe('Skips to the previous song');
		expect(command.data.name).toBe('back');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
	});

	it('should not back if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should back to the previous song', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		const song = mockQueue.songs[0];
		client.distube.jump = vi.fn().mockReturnValue(song);

		await command.run(mockInteraction, client);

		const embed = utils.BaseSuccessEmbed(`Skipped to the previous song: [${song.name}](${song.url})`);
		expect(client.distube.jump).toHaveBeenCalledWith(mockInteraction.guildId, -1);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [embed] });
	});

	it('should not back if there is no previous song', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		client.distube.jump = vi.fn().mockRejectedValue(new Error('No previous song'));

		await command.run(mockInteraction, client);

		const embed = utils.BaseErrorEmbed('There is no previous song to skip to!');
		expect(client.distube.jump).toHaveBeenCalledWith(mockInteraction.guildId, -1);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [embed] });
	});
});
