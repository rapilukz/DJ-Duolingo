import { Event } from '../Interfaces';
import { GuildMember } from 'discord.js';

export const event: Event = {
  name: 'guildMemberAdd',
  run: async (client, member: GuildMember) => {
    console.log('Someone has joined')
  },
};
