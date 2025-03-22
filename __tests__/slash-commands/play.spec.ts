import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/play';
import { GuildMember, PermissionFlagsBits, SlashCommandIntegerOption } from 'discord.js';
import { mockInteraction } from '../mocks/discordMocks';
import logger from '@/utils/logger';

describe('Rewind', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });

		vi.clearAllMocks();
	});

	it('should have the correct command data', () => {
		const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

		expect(command.category).toBe('Music');
		expect(command.description).toBe('Play a music in your voice channel');
		expect(command.data.name).toBe('play');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
		expect(command.data.options).toHaveLength(1);

		const option = command.data.options[0] as SlashCommandIntegerOption;
		expect(option.name).toBe('song');
		expect(option.description).toBe('The song you want to play');
		expect(option.required).toBe(true);
	});

	it('should not play if there is no song', async () => {
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: null });
		await command.run(mockInteraction, client);

		expect(client.distube.play).not.toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith('Please provide a song to play!');
	});

	it('should play the song', async () => {
		const song = 'song';
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: song });

		await command.run(mockInteraction, client);

		const user = mockInteraction.member as GuildMember;
		const voiceChannel = user.voice.channel;
		expect(client.distube.play).toHaveBeenCalledWith(voiceChannel, song, {
			textChannel: voiceChannel,
			member: user,
			metadata: { interaction: mockInteraction },
		});
	});

	it('should handle errors', async () => {
		const song = 'song';
		mockInteraction.options.get = vi.fn().mockReturnValue({ value: song });
		const error = new Error('error');

		client.distube.play = vi.fn().mockRejectedValue(error);

		await command.run(mockInteraction, client);

		expect(logger.error).toHaveBeenCalledWith('Failed to use /play command', { error, server: mockInteraction.guild?.name, query: song });
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: '❌ Oops! There was an error trying to play the song. Please try again or contact support if the issue persists.',
			ephemeral: true,
		});
	});
});
