import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../Interfaces/Event';

export const event: DisTubeEvent = {
	name: Events.FINISH_SONG,
	run: async (queue: Queue, song: Song<DisTubeMetadata>) => {
		try {
			const messageId = song.metadata.messageId;
			if (!messageId) return;

			const message = await song.metadata.interaction.channel?.messages.fetch(messageId);
			if (!message) return;

			await message.delete();
		}
		catch (error) {
			console.error('Failed to delete message:', error);
		}
	},
};
