import { Client, ActivityType } from 'discord.js';
import { Event } from '../Interfaces';


export const event: Event = {
	name: 'ready',
	run: async (client: Client) => {
		client.user?.setActivity({
			name: 'Tikiti on Loop',
			type: ActivityType.Listening,
		});

		console.log(`${client.user?.username} is online!`);
	},
};
