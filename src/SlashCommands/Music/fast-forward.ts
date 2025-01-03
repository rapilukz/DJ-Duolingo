import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';
import { BaseErrorEmbed, isVoiceChannel } from '../../Utils/functions';

export const command: SlashCommand = {
	category: 'Music',
	description: 'Fast forward the player by your specified amount of seconds. The default is 10 seconds.',
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
		if (!isVoiceChannel(interaction)) return interaction.reply('You need to be in a voice channel to use this command!');
		const guildId = interaction.guildId as string;

		const option = interaction.options?.get('seconds');
		const inputSeconds = option?.value ? Number(option.value) : 10;

		const queue = client.distube.getQueue(guildId);
		if (!queue || !queue.playing) return interaction.reply('There is nothing playing!');

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