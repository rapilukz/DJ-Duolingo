import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { BaseErrorEmbed, BaseSuccessEmbed, isVoiceChannel, NoMusicPlayingEmbed } from '../../utils/functions.js';
import { RepeatMode } from 'distube';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Toggle looping the current playing song',
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Toggle looping the current playing song')
		.addNumberOption(
			option => option.setName('method')
				.setRequired(true)
				.setDescription('The method of looping')
				.addChoices({
					name: '🎵 Song',
					value: 1,
				},
				{
					name: '🎶 Queue',
					value: 2,
				},
				{
					name: '❌ Off',
					value: 0,
				},
				),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');
		const guildId = interaction.guildId as string;

		const option = interaction.options?.get('method');
		const method = option !== undefined ? Number(option?.value) : 1;

		const queue = client.distube.getQueue(guildId);
		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		const currentMethod = client.distube.setRepeatMode(guildId, method);

		if (currentMethod === RepeatMode.DISABLED) {
			return interaction.reply({ embeds: [BaseErrorEmbed('Turning off Looping')] });
		}
		else if (currentMethod === RepeatMode.SONG) {
			const song = queue.songs[0];
			const embed = BaseSuccessEmbed(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
				.setAuthor({ name: 'Playing on Loop', iconURL: queue.client.user?.displayAvatarURL() || undefined });

			return interaction.reply({ embeds: [embed] });
		}
		else if (currentMethod === RepeatMode.QUEUE) {
			return interaction.reply({ embeds: [BaseSuccessEmbed('Playing the Queue on Loop!')] });
		}
	},
};