import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { isVoiceChannel, NoMusicPlayingEmbed } from '../../utils/functions.js';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Set the autoplay mode',
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Set the autoplay mode')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		const autoplay = queue.toggleAutoplay();
		interaction.reply(`Autoplay mode has been ${autoplay ? 'enabled' : 'disabled'}`);
	},
};