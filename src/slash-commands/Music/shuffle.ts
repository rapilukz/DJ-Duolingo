import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Colors, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { NoMusicPlayingEmbed } from '../../utils/functions';


export const command: SlashCommand = {
	category: 'Music',
	description: 'Shuffles the queue',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the queue')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue) return NoMusicPlayingEmbed(interaction);

		const newQueue = await client.distube.shuffle(guildId);
		const newQueueEmbed = new EmbedBuilder()
			.setTitle('🎶 Queue Shuffled')
			.setDescription(newQueue.songs.map((song, i) => {
				return `${i === 0 ? '**Playing:**' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
			}).join('\n'))
			.setColor(Colors.Green)
			.setTimestamp();

		interaction.reply({ embeds: [newQueueEmbed] });
		return;
	},
};