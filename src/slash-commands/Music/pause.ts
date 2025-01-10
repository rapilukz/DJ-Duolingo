import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, EmbedBuilder, Colors } from 'discord.js';
import ExtendedClient from '../../client';
import { isVoiceChannel, BaseErrorEmbed, NoMusicPlayingEmbed } from '../../utils/functions.js';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Pauses the player',
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the player')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue) return NoMusicPlayingEmbed(interaction);

		if (!queue.playing) {
			const embed = BaseErrorEmbed('The music is already paused!');
			return interaction.reply({ embeds: [embed] });
		}

		queue.distube.pause(guildId);
		const stoppedEmbed = new EmbedBuilder()
			.setDescription('The music has been stopped!')
			.setColor(Colors.Red);

		return interaction.reply({ embeds: [stoppedEmbed] });
	},
};