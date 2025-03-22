import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { BaseErrorEmbed, NoMusicPlayingEmbed } from '../../utils/functions';
import { Song } from 'distube';
import { DisTubeMetadata } from '../../interfaces/Event';

export const command: SlashCommand = {
	category: 'Music',
	description: 'stop music',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stop music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue) return NoMusicPlayingEmbed(interaction);

		client.distube.stop(guildId);

		const song = queue.songs[0] as Song<DisTubeMetadata>;
		const songMessageId = song.metadata.messageId as string;

		const message = interaction.channel?.messages.fetch(songMessageId);
		if (message) (await message).delete();

		const embed = BaseErrorEmbed('The music has been stopped!');
		return interaction.reply({ embeds: [embed] });
	},
};