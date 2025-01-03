import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { isVoiceChannel, NoMusicPlayingEmbed } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Rewind forward the player by your specified amount of seconds. The default is 10 seconds.',
	data: new SlashCommandBuilder()
		.setName('rewind')
		.setDescription('Rewind forward the player by your specified amount of seconds. The default is 10 seconds.')
		.addNumberOption(option => option.setName('seconds')
			.setDescription('The amount of seconds to fast forward')
			.setRequired(false)
			.setMinValue(0),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	run: async (interaction: CommandInteraction, client: ExtendedClient) => {
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');
		const guildId = interaction.guildId as string;

		const option = interaction.options?.get('seconds');
		const inputSeconds = option?.value ? Number(option.value) : 10;

		const queue = client.distube.getQueue(guildId);
		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		// Time in seconds
		const currentTime = queue.currentTime;
		const newTime = currentTime - inputSeconds;

		client.distube.seek(guildId, newTime);
		return interaction.reply({ content: `Rewinded by ${inputSeconds} seconds!`, ephemeral: true });
	},
};