import { Events } from 'distube';
import { DisTubeEvent } from '../../Interfaces/Event';

export const event: DisTubeEvent = {
	name: Events.FFMPEG_DEBUG,
	run: (message) => {
		console.log(message);
	},
};