import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember, VoiceBasedChannel } from 'discord.js';
import ExtendedClient from '../../client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'join channel',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('join channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;

		const voiceChannel = user.voice.channel as VoiceBasedChannel;
		client.distube.voices.join(voiceChannel);
		interaction.reply(`Joined the voice channel! ${voiceChannel}`);
	},
};