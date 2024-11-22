import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, EmbedBuilder, Colors } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel, BaseErrorEmbed } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'pause the current music',
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pause the current music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue) {
			const embed = BaseErrorEmbed('There is nothing playing!');
			return interaction.reply({ embeds: [embed] });
		}

		if (!queue.playing) {
			const embed = BaseErrorEmbed('The music is already paused!');
			return interaction.reply({ embeds: [embed] });
		}

		queue.pause();
		const stoppedEmbed = new EmbedBuilder()
			.setDescription('The music has been stopped!')
			.setColor(Colors.Red);

		return interaction.reply({ embeds: [stoppedEmbed] });
	},
};