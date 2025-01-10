import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, EmbedBuilder, Colors } from 'discord.js';
import ExtendedClient from '../../client';
import { isVoiceChannel, NoMusicPlayingEmbed } from '../../utils/functions.js';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Skip the current song',
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		// if there is no next song, send a message and return
		if (!queue.songs[1]) {
			const noNextSongEmbed = new EmbedBuilder()
				.setDescription('There is no next song to skip to!')
				.setColor(Colors.Red);

			return interaction.reply({ embeds: [noNextSongEmbed] });
		}

		queue.distube.skip(guildId);

		const stoppedEmbed = new EmbedBuilder()
			.setDescription('The music has been skipped!')
			.setColor(Colors.Green);

		return interaction.reply({ embeds: [stoppedEmbed] });
	},
};