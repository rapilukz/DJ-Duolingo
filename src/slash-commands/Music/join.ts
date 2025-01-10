import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember, VoiceBasedChannel } from 'discord.js';
import ExtendedClient from '../../client';
import { isVoiceChannel } from '../../utils/functions.js';

export const command: SlashCommand = {
	category: 'Music',
	description: 'join channel',
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('join channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const voiceChannel = user.voice.channel as VoiceBasedChannel;
		client.distube.voices.join(voiceChannel);
		interaction.reply(`Joined the voice channel! ${voiceChannel}`);
	},
};