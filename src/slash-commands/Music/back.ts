import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { BaseErrorEmbed, BaseSuccessEmbed, NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Skips to the previous song',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('back')
		.setDescription('Skips to the previous song')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;

		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		try {
			const song = await client.distube.jump(guildId, -1);
			const skippedEmbed = BaseSuccessEmbed(`Skipped to the previous song: [${song.name}](${song.url})`);
			return interaction.reply({ embeds: [skippedEmbed] });
		}
		catch {
			const embed = BaseErrorEmbed('There is no previous song to skip to!');
			return interaction.reply({ embeds: [embed] });
		}

	},
};