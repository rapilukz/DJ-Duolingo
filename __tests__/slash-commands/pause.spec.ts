import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/pause';
import { Colors, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, MockQueueOptions, createMockQueue, noMusicPlayingMockEmbed } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';
import { EmbedBuilder } from '@discordjs/builders';


describe('Pause', () => {
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
		expect(command.description).toBe('Pauses the player');
		expect(command.data.name).toBe('pause');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
	});

	it('should not pause if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(mockInteraction, client);

		expect(utils.NoMusicPlayingEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should not pause if the music is already paused', async () => {
		mockQueueOptions.playing = false;
		mockQueueOptions.paused = true;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(utils.BaseErrorEmbed).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseErrorEmbed('The music is already paused!')] });
		expect(mockQueue.distube.pause).not.toHaveBeenCalled();
	});

	it('should pause the music if it is playing', async () => {
		mockQueueOptions.playing = true;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		const embed = new EmbedBuilder()
			.setDescription('The music has been stopped!')
			.setColor(Colors.Red);

		expect(mockQueue.distube.pause).toBeCalledWith(mockInteraction.guildId);
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [embed] });

	});
});