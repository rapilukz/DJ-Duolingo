import { SlashCommand } from '../../Interfaces';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, Colors } from 'discord.js';
import { isVoiceChannel, NoMusicPlayingEmbed } from '../../Utils/functions';
import ExtendedClient from '../../Client';

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