import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/resume';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, MockQueueOptions, mockMember, noMusicPlayingMockEmbed, createMockQueue } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';

describe('Resume', () => {
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

	const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('resumes the music');
		expect(command.data.name).toBe('resume');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(
			permissions.toString(),
		);
	});

	it('should not resume if there is no queue', async () => {
		const interaction = {
			...mockInteraction,
			member: mockMember,
		} as CommandInteraction;

		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await command.run(interaction, client);

		expect(interaction.reply).toHaveBeenCalledWith({ embeds: [noMusicPlayingMockEmbed], ephemeral: true });
	});

	it('should resume the music if it is paused', async () => {
		mockQueueOptions.paused = true;

		const mockQueue = createMockQueue(mockQueueOptions);

		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(mockQueue.resume).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseSuccessEmbed('You hit the resume button, the music is now playing!')] });
	});

	it('should not resume the music if it is already playing', async () => {
		mockQueueOptions.playing = true;

		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await command.run(mockInteraction, client);

		expect(mockQueue.resume).not.toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [utils.BaseErrorEmbed('The music is already playing!')] });
	});
});