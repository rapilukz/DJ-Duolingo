import { button } from '@/buttons/pause-resume';
import ExtendedClient from '@/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockInteraction, createMockQueue, MockQueueOptions } from '../mocks/discordMocks';
import { BaseSuccessEmbed, BaseErrorEmbed } from '@/utils/functions';
import { ChatInputCommandInteraction } from 'discord.js';

describe('Loop Button', () => {
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

	it('should have the correct button id', () => {
		expect(button.id).toBe('pause-resume');
	});

	it('should not run if there is no queue', async () => {
		client.distube.getQueue = vi.fn().mockReturnValue(null);

		await button.run(client, mockInteraction);

		expect(client.distube.getQueue).toHaveBeenCalledWith(mockInteraction.guildId);
		expect(mockInteraction.deferReply).not.toHaveBeenCalled();
		expect(mockInteraction.deleteReply).not.toHaveBeenCalled();
	});

	it('should resume the queue if it is paused', async () => {
		const interaction = mockInteraction as unknown as ChatInputCommandInteraction<'cached'>;
		mockQueueOptions.paused = true;
		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await button.run(client, interaction);

		expect(mockQueue.resume).toHaveBeenCalled();
		expect(interaction.deferReply).toHaveBeenCalled();
		expect(interaction.deleteReply).toHaveBeenCalled();
		expect(interaction.channel?.send).toHaveBeenCalledWith({
			embeds: [BaseSuccessEmbed('You hit the resume button, the music is now playing!')],
		});
	});

	it('should pause the queue if it is playing', async () => {
		const interaction = mockInteraction as unknown as ChatInputCommandInteraction<'cached'>;
		mockQueueOptions.playing = true;
		const mockQueue = createMockQueue(mockQueueOptions);
		client.distube.getQueue = vi.fn().mockReturnValue(mockQueue);

		await button.run(client, interaction);

		expect(mockQueue.pause).toHaveBeenCalled();
		expect(interaction.deferReply).toHaveBeenCalled();
		expect(interaction.deleteReply).toHaveBeenCalled();
		expect(interaction.channel?.send).toHaveBeenCalledWith({
			embeds: [BaseErrorEmbed('You hit the pause button, the music is now paused!')],
		});
	});
});
