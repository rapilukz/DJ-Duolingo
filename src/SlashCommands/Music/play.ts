import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits, GuildMember } from 'discord.js';
import ExtendedClient from '../../Client';

export const command: SlashCommand = {
	category: 'Music',
	description: 'play music',
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect)
		.addStringOption(option =>
			option
				.setName('song')
				.setDescription('The song you want to play')
				.setRequired(true)),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const user = interaction.member as GuildMember;
		const voiceChannel = user.voice.channel;

		if (!voiceChannel) return interaction.reply('You need to be in a voice channel to play music!');

		const embed = new EmbedBuilder()
			.setTitle('Reading your request...');

		const song = interaction.options.get('song')?.value as string;

		if (!song) return interaction.reply('Please provide a song to play!');

		await interaction.reply({ embeds: [embed] });

		await client.distube.play(voiceChannel, song, {
			textChannel: voiceChannel,
			member: user,
			metadata: { interaction },
		});
	},
};