import { Client, ActivityType } from 'discord.js';
import { Event } from '../../interfaces';


export const event: Event = {
	name: 'ready',
	run: async (client: Client) => {

		const statusArray = [
			`${client.guilds.cache.size} Servers`,
			'Tikiti on Loop',
		];

		const typesOfStatus = [
			ActivityType.Watching,
			ActivityType.Listening,
		];

		// Every 10 seconds, change the status
		let pos = 0;
		setInterval(() => {
			if (pos >= statusArray.length) pos = 0;

			client.user?.setActivity({
				name: statusArray[pos],
				type: typesOfStatus[pos],
			});
			pos++;
		}, 10000);

		console.log(`${client.user?.username} is online!`);
	},
};
