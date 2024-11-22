import { Events } from 'distube';
import { DisTubeEvent } from '../../Interfaces/Event';

export const event: DisTubeEvent = {
	name: Events.FFMPEG_DEBUG,
	run: (message) => {
		if (process.env.DEBUG_FFMPEG === 'true') console.log(message);
	},
};