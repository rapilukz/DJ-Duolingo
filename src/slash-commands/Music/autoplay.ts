import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Set the autoplay mode',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Set the autoplay mode')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		const autoplay = queue.toggleAutoplay();
		interaction.reply(`Autoplay mode has been ${autoplay ? 'enabled' : 'disabled'}`);
	},
};