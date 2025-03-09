import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Rewind forward the player by your specified amount of seconds. The default is 10 seconds.',
	needsVoiceChannel: true,
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
		const guildId = interaction.guildId as string;

		const option = interaction.options?.get('seconds');
		const inputSeconds = option?.value ? Number(option.value) : 10;

		const queue = client.distube.getQueue(guildId);
		if (!queue || !queue.playing) return NoMusicPlayingEmbed(interaction);

		// Time in seconds
		const time = queue.currentTime - inputSeconds;
		const rewindTime = time < 0 ? 0 : time;


		client.distube.seek(guildId, rewindTime);
		return interaction.reply({ content: `Rewinded by ${inputSeconds} seconds!`, ephemeral: true });
	},
};