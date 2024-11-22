import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember } from 'discord.js';
import ExtendedClient from '../../Client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'leave channel',
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('leave channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;
		const voiceChannel = user.voice.channel;
		if (!voiceChannel) return interaction.reply('You need to be in a voice channel to use this command!');

		client.distube.voices.leave(voiceChannel);
		interaction.reply(`Left the voice channel! ${voiceChannel}`);
	},
};