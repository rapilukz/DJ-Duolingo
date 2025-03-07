import { vi } from 'vitest';
import { VoiceBasedChannel, CommandInteraction, GuildMember } from 'discord.js';

const mockVoiceChannel = {
	id: '123456789',
	name: 'General Voice',
} as VoiceBasedChannel;

const mockInteraction = {
	reply: vi.fn(),
	member: {},
	guildId: '111111111',
} as unknown as CommandInteraction;

const mockMember = {
	voice: {
		channel: mockVoiceChannel,
	},
} as unknown as GuildMember;

export {
	mockVoiceChannel,
	mockInteraction,
	mockMember,
};