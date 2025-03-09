import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { BaseErrorEmbed, BaseSuccessEmbed, NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'resumes the music',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('resumes the music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;

		const queue = client.distube.getQueue(guildId);
		if (!queue) return NoMusicPlayingEmbed(interaction);

		if (queue.paused) {
			queue.resume();
			const embed = BaseSuccessEmbed('You hit the resume button, the music is now playing!');

			return interaction.reply({ embeds: [embed] });
		}

		if (queue.playing) {
			const embed = BaseErrorEmbed('The music is already playing!');
			return interaction.reply({ embeds: [embed] });
		}
	},
};