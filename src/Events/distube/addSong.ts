import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../Interfaces/Event';

export const event: DisTubeEvent = {
	name: Events.ADD_SONG,
	run: (queue: Queue, song: Song<DisTubeMetadata>) => {
		console.log(song.name);
	},
};