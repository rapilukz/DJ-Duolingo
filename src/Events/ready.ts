import { Client } from 'discord.js';
import { Event } from '../Interfaces';


export const event: Event = {
  name: 'ready',
  run: async (client: Client) => {
    console.log(`${client.user?.username} is online!`);
  },
};
