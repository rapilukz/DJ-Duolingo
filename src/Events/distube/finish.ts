import { Events, Queue } from 'distube';
import { DisTubeEvent } from '../../Interfaces/Event';
import { EmbedBuilder } from '@discordjs/builders';
import { Colors } from 'discord.js';

export const event: DisTubeEvent = {
	name: Events.FINISH,
	run: (queue: Queue) => {
		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setDescription('No more songs in the queue')
			.setTimestamp();

		queue.textChannel?.send({ embeds: [embed] });
	},
};