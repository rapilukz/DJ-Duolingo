import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { BaseSuccessEmbed, NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Replays the current song',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('replay')
		.setDescription('Replays the current song')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		const song = queue.songs[0];
		client.distube.seek(guildId, 0);

		const embed = BaseSuccessEmbed(`Replaying: [${song.name}](${song.url}) from the beginning`);
		return interaction.reply({ embeds: [embed] });
	},
};