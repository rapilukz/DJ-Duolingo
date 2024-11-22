import { SlashCommand } from '../../Interfaces';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'See the current queue',
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the current queue')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return interaction.reply('There is nothing playing!');

		const embed = new EmbedBuilder()
			.setTitle('Queue')
			.setDescription(queue.songs.map((song, i) => {
				return `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
			}).join('\n'))
			.setColor(0x00FF00)
			.setTimestamp();

		interaction.reply({ embeds: [embed] });
	},
};