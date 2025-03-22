import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/loop';
import { PermissionFlagsBits, SlashCommandIntegerOption } from 'discord.js';
import { mockInteraction, createMockQueue, MockQueueOptions, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Loop', () => {
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
		expect(command.description).toBe('Toggle looping the current playing song');
		expect(command.data.name).toBe('loop');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
		expect(command.data.options).toHaveLength(1);

		const option = command.data.options[0] as SlashCommandIntegerOption;
		expect(option.name).toBe('method');
		expect(option.description).toBe('The method of looping');
		expect(option.required).toBe(true);

		const choices = option.choices!;
		expect(choices).toHaveLength(3);

		expect(choices[0].name).toBe('🎵 Song');
		expect(choices[0].value).toBe(1);

		expect(choices[1].name).toBe('🎶 Queue');
		expect(choices[1].value).toBe(2);

		expect(choices[2].name).toBe('❌ Off');
		expect(choices[2].value).toBe(0);
	});

	it('should not loop if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should turn off looping', async () => {
		mockQueueOptions.playing = true;
		const value = 0;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		mockInteraction.options.get = vi.fn().mockReturnValue({ value: value });
		client.distube.setRepeatMode = vi.fn().mockReturnValue(value);

		await command.run(mockInteraction, client);

		expect(client.distube.setRepeatMode).toHaveBeenCalledWith(mockInteraction.guildId, value);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseErrorEmbed('Turning off Looping')] });
	});

	it('should loop the current song', async () => {
		mockQueueOptions.playing = true;
		const value = 1;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		mockInteraction.options.get = vi.fn().mockReturnValue({ value: value });
		client.distube.setRepeatMode = vi.fn().mockReturnValue(value);

		const song = mockQueue.songs[0];

		await command.run(mockInteraction, client);

		const embed = utils.BaseSuccessEmbed(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
			.setAuthor({ name: 'Playing on Loop', iconURL: mockQueue.client.user?.displayAvatarURL() || undefined });

		expect(client.distube.setRepeatMode).toHaveBeenCalledWith(mockInteraction.guildId, value);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [embed] });
	});

	it('should loop the queue', async () => {
		mockQueueOptions.playing = true;
		const value = 2;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		mockInteraction.options.get = vi.fn().mockReturnValue({ value: value });
		client.distube.setRepeatMode = vi.fn().mockReturnValue(value);

		await command.run(mockInteraction, client);

		expect(client.distube.setRepeatMode).toHaveBeenCalledWith(mockInteraction.guildId, value);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseSuccessEmbed('Playing the Queue on Loop!')] });
	});

	it('should loop the song by default', async () => {
		mockQueueOptions.playing = true;
		const value = 1;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		mockInteraction.options.get = vi.fn().mockReturnValue(undefined);
		client.distube.setRepeatMode = vi.fn().mockReturnValue(value);

		const song = mockQueue.songs[0];

		await command.run(mockInteraction, client);

		const embed = utils.BaseSuccessEmbed(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
			.setAuthor({ name: 'Playing on Loop', iconURL: mockQueue.client.user?.displayAvatarURL() || undefined });

		expect(client.distube.setRepeatMode).toHaveBeenCalledWith(mockInteraction.guildId, value);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [embed] });

	});
});
