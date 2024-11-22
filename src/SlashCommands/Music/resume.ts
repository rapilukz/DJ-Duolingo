import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'resumes the music',
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('resumes the music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');


	},
};