import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel, BaseErrorEmbed, BaseSuccessEmbed, NoMusicPlayingEmbed } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Skips to the previous song',
	data: new SlashCommandBuilder()
		.setName('back')
		.setDescription('Skips to the previous song')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');
		const guildId = interaction.guildId as string;

		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed();

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