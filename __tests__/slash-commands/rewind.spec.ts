import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/rewind';
import { PermissionFlagsBits, SlashCommandIntegerOption } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Fast forward', () => {
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
		expect(command.description).toBe('Rewind forward the player by your specified amount of seconds. The default is 10 seconds.');
		expect(command.data.name).toBe('rewind');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
		expect(command.data.options).toHaveLength(1);

		const option = command.data.options[0] as SlashCommandIntegerOption;
		expect(option.name).toBe('seconds');
		expect(option.description).toBe('The amount of seconds to rewind');
		expect(option.required).toBe(false);
		expect(option.min_value).toBe(0);
	});

	it('should not rewind if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should rewind by the specified amount of seconds', async () => {
		mockQueueOptions.playing = true;
		const time = 5;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: time });

		await command.run(mockInteraction, client);

		const rewindTime = mockQueue.currentTime - time;
		const expectedTime = rewindTime < 0 ? 0 : rewindTime;

		expect(client.distube.seek).toHaveBeenCalledWith(mockInteraction.guildId, expectedTime);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ content: `Rewinded by ${time} seconds!`, ephemeral: true });
	});

	it('should rewind by the default amount of seconds', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.options.get = vi.fn().mockReturnValue(undefined);

		await command.run(mockInteraction, client);

		const expectedTime = mockQueue.currentTime - 10;

		expect(client.distube.seek).toHaveBeenCalledWith(mockInteraction.guildId, expectedTime);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ content: `Rewinded by ${10} seconds!`, ephemeral: true });
	});

	it('should rewind to 0 if the rewind time is negative', async () => {
		mockQueueOptions.playing = true;
		mockQueueOptions.currentTime = 5;

		// Set a very low current time so that subtraction makes it negative
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: 10 });

		await command.run(mockInteraction, client);

		// Expected time should be 0, because 5 - 10 = -5 (which is clamped to 0)
		expect(client.distube.seek).toHaveBeenCalledWith(mockInteraction.guildId, 0);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ content: 'Rewinded by 10 seconds!', ephemeral: true });
	});

});
