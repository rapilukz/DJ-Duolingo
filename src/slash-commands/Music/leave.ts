import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember } from 'discord.js';
import ExtendedClient from '../../client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'leave channel',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('leave channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;
		const guildId = interaction.guildId as string;

		const voiceChannel = user.voice.channel;
		client.distube.voices.leave(guildId);
		interaction.reply(`Left the voice channel! ${voiceChannel}`);
	},
};