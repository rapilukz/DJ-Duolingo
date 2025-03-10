import { vi } from 'vitest';
import { VoiceBasedChannel, CommandInteraction, GuildMember, Colors, Message } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Queue } from 'distube';

const mockMessage = {
	delete: vi.fn(),
	id: '123456789',
} as unknown as Message;

const mockVoiceChannel = {
	id: '123456789',
	name: 'General Voice',
} as VoiceBasedChannel;

const mockMember = {
	voice: {
		channel: mockVoiceChannel,
	},
} as unknown as GuildMember;

const mockInteraction = {
	reply: vi.fn(),
	member: mockMember,
	guildId: '111111111',
	channel: {
		messages: {
			fetch: vi.fn(),
		},
	},
} as unknown as CommandInteraction;

export interface MockQueueOptions {
	playing?: boolean;
	toggleAutoplay?: boolean;
	paused?: boolean;
}

function createMockQueue(options: MockQueueOptions) : Queue {
	return {
		playing: options.playing || false,
		toggleAutoplay: vi.fn().mockReturnValue(options.toggleAutoplay || false),
		resume: vi.fn(),
		pause: vi.fn(),
		paused: options.paused || false,
		distube: {
			pause: vi.fn(),
			resume: vi.fn(),
			stop: vi.fn(),
			skip: vi.fn(),
		},
		songs: [
			{
				name: 'Song 1',
				formattedDuration: '3:00',
				metadata: {
					messageId: mockMessage.id,
				},
			},
			{
				name: 'Song 2',
				formattedDuration: '4:20',
				metadata: {
					messageId: '987654321',
				},
			},
		],
	} as unknown as Queue;
}

const noMusicPlayingMockEmbed = new EmbedBuilder()
	.setDescription('There is nothing playing!')
	.setColor(Colors.Red)
	.setTimestamp();

export {
	mockVoiceChannel,
	mockInteraction,
	mockMember,
	mockMessage,
	noMusicPlayingMockEmbed,
	createMockQueue,
};