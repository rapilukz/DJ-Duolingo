import { ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { BaseErrorEmbed, BaseSuccessEmbed } from '../Utils/functions';
import { Button } from '../Interfaces/Button';
import Client from '../Client';

export const button: Button = {
	id: 'pause_resume',
	run: async (client: Client, interaction: CommandInteraction) => {
		const queue = client.distube.getQueue(interaction.guildId as string);
		const newInteraction = interaction as ChatInputCommandInteraction<'cached'>;
		if (!queue) return;
		await interaction.deferReply();
		await interaction.deleteReply();

		if (queue.paused) {
			queue.resume();
			const embed = BaseSuccessEmbed('You hit the resume button, the music is now playing!');
			return newInteraction.channel?.send({ embeds: [embed] });
		}


		if (queue.playing) {
			queue.pause();
			const embed = BaseErrorEmbed('You hit the pause button, the music is now paused!');
			return newInteraction.channel?.send({ embeds: [embed] });
		}
	},
};
