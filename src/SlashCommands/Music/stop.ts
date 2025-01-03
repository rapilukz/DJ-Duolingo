import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel, BaseErrorEmbed, NoMusicPlayingEmbed } from '../../Utils/functions';
import { Song } from 'distube';
import { DisTubeMetadata } from '../../Interfaces/Event';

export const command: SlashCommand = {
	category: 'Music',
	description: 'stop music',
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stop music')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');

		const guildId = interaction.guildId as string;
		const queue = client.distube.getQueue(guildId);

		if (!queue) return NoMusicPlayingEmbed();

		client.distube.stop(guildId);

		const song = queue.songs[0] as Song<DisTubeMetadata>;
		const songMessageId = song.metadata.messageId as string;

		const message = interaction.channel?.messages.fetch(songMessageId);
		if (message) (await message).delete();

		const embed = BaseErrorEmbed('The music has been stopped!');
		return interaction.reply({ embeds: [embed] });
	},
};