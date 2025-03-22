import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/skipTo';
import { PermissionFlagsBits, SlashCommandIntegerOption } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Skip To', () => {
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
		expect(command.description).toBe('Skip to a specific song in the queue');
		expect(command.data.name).toBe('skip-to');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
		expect(command.data.options).toHaveLength(1);

		const option = command.data.options[0] as SlashCommandIntegerOption;
		expect(option.name).toBe('position');
		expect(option.description).toBe('The position of the song in the queue');
		expect(option.required).toBe(true);
		expect(option.min_value).toBe(1);
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
		expect(client.distube.jump).not.toHaveBeenCalled();
	});

	it('should not skip if the position is greater than the queue length', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: 5 });

		await command.run(mockInteraction, client);

		expect(mockInteraction.reply).toHaveBeenCalledWith({ content: 'The position you provided is greater than the queue length! use /queue to see the current queue', ephemeral: true });
		expect(client.distube.jump).not.toHaveBeenCalled();
	});

	it('should skip to the correct song', async () => {
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);
		const position = 1;

		client.distube.jump = vi.fn().mockReturnValue(mockQueue.songs[position]);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: position });

		await command.run(mockInteraction, client);


		expect(client.distube.jump).toHaveBeenCalledWith(mockInteraction.guildId, 1);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseSuccessEmbed('Skipped to **Song 2**!')] });
	});
});
