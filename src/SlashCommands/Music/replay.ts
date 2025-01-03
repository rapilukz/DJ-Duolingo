import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { BaseSuccessEmbed, isVoiceChannel } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Replays the current song',
	data: new SlashCommandBuilder()
		.setName('replay')
		.setDescription('Replays the current song')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return interaction.reply('There is nothing playing!');

		const song = queue.songs[0];
		client.distube.seek(guildId, 0);

		const embed = BaseSuccessEmbed(`Replaying: [${song.name}](${song.url})`);
		return interaction.reply({ embeds: [embed] });
	},
};