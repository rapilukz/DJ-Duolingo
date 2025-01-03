import { DisTubeError, Events, Queue } from 'distube';
import { DisTubeEvent } from '../../Interfaces/Event';
import { EmbedBuilder } from '@discordjs/builders';
import { Colors } from 'discord.js';

export const event: DisTubeEvent = {
	name: Events.NO_RELATED,
	run(queue: Queue, error: DisTubeError) {
		queue.textChannel?.send({
			embeds: [new EmbedBuilder().setColor(Colors.Red).setTitle('DisTube').setDescription(error.message)],
		});
	},
};