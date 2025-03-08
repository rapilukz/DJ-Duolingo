import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';

export const command: SlashCommand = {
	category: 'Util',
	description: 'Ping the bot',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	run: async (interaction: CommandInteraction) => {
		interaction.reply('Pong!');
	},
};