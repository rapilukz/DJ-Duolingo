import { vi } from 'vitest';
import { VoiceBasedChannel, CommandInteraction, GuildMember, Colors } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';

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


const noMusicPlayingMockEmbed = new EmbedBuilder()
	.setDescription('There is nothing playing!')
	.setColor(Colors.Red)
	.setTimestamp();

export {
	mockVoiceChannel,
	mockInteraction,
	mockMember,
	noMusicPlayingMockEmbed,
};