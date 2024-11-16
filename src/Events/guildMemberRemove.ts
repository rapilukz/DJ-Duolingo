import { Event } from '../Interfaces'; 

export const event: Event = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        console.log('Someone has left')
    }
}