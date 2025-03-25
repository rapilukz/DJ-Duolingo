import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/stop';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed, mockMessage } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Stop', () => {
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

	const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('stop music');
		expect(command.data.name).toBe('stop');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			permissions.toString(),
		);
	});

	it('should not stop if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [noMusicPlayingMockEmbed],
			ephemeral: true,
		});

		expect(client.distube.stop).not.toHaveBeenCalled();
	});

	it('should stop the music if it is playing', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(client.distube.stop).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [utils.BaseErrorEmbed('The music has been stopped!')],
		});
	});

	it('should delete the song message if it exists', async () => {
		mockQueueOptions.playing = true;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.channel!.messages.fetch = vi.fn().mockReturnValue(mockMessage);

		await command.run(mockInteraction, client);

		const message = await mockInteraction.channel?.messages.fetch();

		expect(mockInteraction.channel?.messages.fetch).toHaveBeenCalledWith(mockMessage.id);
		expect(message).toBeDefined();
		expect(message?.delete).toHaveBeenCalled();
	});

});