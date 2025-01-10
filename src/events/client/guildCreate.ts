import { Guild } from 'discord.js';
import { Event } from '../../interfaces';
import logger from '../../utils/logger';
import ExtendedClient from '../../client';


export const event: Event = {
	name: 'guildCreate',
	run: async (client: ExtendedClient, guild: Guild) => {
		logger.info('Joined a new guild! ', { guild: guild.name, guildId: guild.id });
	},
};
