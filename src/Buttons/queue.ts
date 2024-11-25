import { ButtonInteraction } from 'discord.js';
import Client from '../Client';
import { Button } from '../Interfaces/Button';

export const button: Button = {
	id: 'queue',
	run: async (client: Client, interaction: ButtonInteraction) => {
		console.log('Queue button clicked');
	},
};
