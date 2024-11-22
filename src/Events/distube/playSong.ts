import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../Interfaces/Event';
import { EmbedBuilder, Colors, userMention } from 'discord.js';

export const event: DisTubeEvent = {
	name: Events.PLAY_SONG,
	run: (queue: Queue, song: Song<DisTubeMetadata>) => {
		console.log(`Playing ${song.name} in ${queue.textChannel}`);
	},
};