import { SlashCommand } from '../../interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../client';
import { BaseErrorEmbed, NoMusicPlayingEmbed } from '../../utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Fast forward the player by your specified amount of seconds. The default is 10 seconds.',
	needsVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName('fast-forward')
		.setDescription('Fast forward the player by your specified amount of seconds. The default is 10 seconds.')
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
		const currentTime = queue.currentTime;
		const songDuration = queue.songs[0].duration;

		const newTime = currentTime + inputSeconds;

		if (newTime > songDuration) {
			const embed = BaseErrorEmbed('The skip amount is greater than the song duration!');
			return interaction.reply({ embeds: [embed] });
		}

		client.distube.seek(guildId, newTime);
		return interaction.reply(`Fast forwarded the player by ${inputSeconds} seconds!`);
	},
};