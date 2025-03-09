import { SlashCommand } from '../../interfaces';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, Colors } from 'discord.js';
import { NoMusicPlayingEmbed } from '../../utils/functions';
import ExtendedClient from '../../client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'See the current queue',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the current queue')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);
		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		const embed = new EmbedBuilder()
			.setTitle('🎶 Current Queue')
			.setDescription(queue.songs.map((song, i) => {
				return `${i === 0 ? '**Playing:**' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
			}).join('\n'))
			.setColor(Colors.Green)
			.setTimestamp();

		interaction.reply({ embeds: [embed] });
	},
};