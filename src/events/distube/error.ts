import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../interfaces/Event';

export const event: DisTubeEvent = {
	name: Events.ERROR,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	run: async (error: Error, queue: Queue, song?: Song<DisTubeMetadata>) => {
		console.log(error);
	},
};
