import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember, VoiceChannel } from 'discord.js';
import logger from '../../utils/logger';
import ExtendedClient from '../../client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Play a music in your voice channel',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a music in your voice channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect)
		.addStringOption(option =>
			option
				.setName('song')
				.setDescription('The song you want to play')
				.setRequired(true)),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;
		const voiceChannel = user.voice.channel as VoiceChannel;

		const song = interaction.options.get('song')?.value as string;

		if (!song) return interaction.reply('Please provide a song to play!');

		try {
			await client.distube.play(voiceChannel, song, {
				textChannel: voiceChannel,
				member: user,
				metadata: { interaction },
			});
		}
		catch (error) {
			logger.error('Failed to use /play command', { error, server: interaction.guild?.name, query: song });
			await interaction.reply({
				content: '❌ Oops! There was an error trying to play the song. Please try again or contact support if the issue persists.',
				ephemeral: true,
			});
		}

	},
};