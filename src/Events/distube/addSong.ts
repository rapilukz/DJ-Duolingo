import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../Interfaces/Event';
import { EmbedBuilder, Colors } from 'discord.js';

export const event: DisTubeEvent = {
	name: Events.ADD_SONG,
	run: (queue: Queue, song: Song<DisTubeMetadata>) => {
		song.metadata.interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Green)
					.setTitle('Added to queue')
					.setDescription(`Added \`${song.name}\` to the queue`),
			],
		});
	},
};