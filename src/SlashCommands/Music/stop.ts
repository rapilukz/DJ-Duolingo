import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel, BaseErrorEmbed } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'stop music',
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stop music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue) {
			const embed = BaseErrorEmbed('There is nothing playing!');
			return interaction.reply({ embeds: [embed] });
		}

		queue.stop();

		const embed = BaseErrorEmbed('The music has been stopped!');
		return interaction.reply({ embeds: [embed] });
	},
};