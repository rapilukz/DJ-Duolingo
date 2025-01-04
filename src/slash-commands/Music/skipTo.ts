import ExtendedClient from '../../client';
import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { BaseSuccessEmbed, isVoiceChannel, NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Skip to a specific song in the queue',
	data: new SlashCommandBuilder()
		.setName('skip-to')
		.setDescription('Skip to a specific song in the queue')
		.addIntegerOption(
			option => option.setName('position')
				.setDescription('The position of the song in the queue')
				.setRequired(true)
				.setMinValue(1))
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');
		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		const position = interaction.options.get('position');
		if (position?.value as number > queue.songs.length - 1) {
			return interaction.reply({ content: 'The position you provided is greater than the queue length! use /queue to see the current queue', ephemeral: true });
		}

		const newSong = await client.distube.jump(guildId, position?.value as number);

		const skippedEmbed = BaseSuccessEmbed(`Skipped to **${newSong.name}**!`);
		return interaction.reply({ embeds: [skippedEmbed] });

	},
};