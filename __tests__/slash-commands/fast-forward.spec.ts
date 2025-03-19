import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/fast-forward';
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
		expect(command.description).toBe('Fast forward the player by your specified amount of seconds. The default is 10 seconds.');
		expect(command.data.name).toBe('fast-forward');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
		expect(command.data.options).toHaveLength(1);

		const option = command.data.options[0] as SlashCommandIntegerOption;
		expect(option.name).toBe('seconds');
		expect(option.description).toBe('The amount of seconds to fast forward');
		expect(option.required).toBe(false);
		expect(option.min_value).toBe(0);
	});

	it('should not fast forward if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should not fast forward if the time is greater than the song duration', async () => {
		mockQueueOptions.playing = true;
		const time = 1000;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		mockInteraction.options.get = vi.fn().mockReturnValue({ value: time });

		await command.run(mockInteraction, client);

		expect(client.distube.seek).not.toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseErrorEmbed('The skip amount is greater than the song duration!')] });
	});

	it('should fast fowward successfully', async () => {
		mockQueueOptions.playing = true;
		const time = 5;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		mockInteraction.options.get = vi.fn().mockReturnValue({ value: time });
		await command.run(mockInteraction, client);

		const newTime = mockQueue.currentTime + time;
		expect(client.distube.seek).toHaveBeenCalledWith(mockInteraction.guildId, newTime);
		expect(mockInteraction.reply).toHaveBeenCalledWith(`Fast forwarded the player by ${time} seconds!`);
	});

	it('should fast forward by default 10 seconds if no input is given', async () => {
		mockQueueOptions.playing = true;
		const time = 10;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.options.get = vi.fn().mockReturnValue(undefined);

		await command.run(mockInteraction, client);

		const expectedTime = mockQueue.currentTime + time;
		expect(client.distube.seek).toHaveBeenCalledWith(mockInteraction.guildId, expectedTime);
		expect(mockInteraction.reply).toHaveBeenCalledWith(`Fast forwarded the player by ${time} seconds!`);
	});
});
