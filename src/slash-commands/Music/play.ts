import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember } from 'discord.js';
import ExtendedClient from '../../client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Play a music in your voice channel',
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
		const voiceChannel = user.voice.channel;

		if (!voiceChannel) return interaction.reply('You need to be in a voice channel to play music!');

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
			console.error(error);
			interaction.reply('There was an error playing the song/playlist!');
		}

	},
};