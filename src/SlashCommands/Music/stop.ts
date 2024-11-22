import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember } from 'discord.js';
import ExtendedClient from '../../Client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'stop music',
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stop music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;
		const voiceChannel = user.voice.channel;
		if (!voiceChannel) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue || !queue.playing) return interaction.reply('There is nothing playing!');

		queue.stop();
		queue.voice.leave();
	},
};