import { CommandInteraction } from 'discord.js';
import Client from '../Client';
import { Button } from '../Interfaces/Button';

export const button: Button = {
	id: 'back',
	run: async (client: Client, interaction: CommandInteraction) => {
		const command = client.SlashCommands.get('back');
		if (!command) return interaction.reply({ content: 'Command not found', ephemeral: true });

		command.run(interaction, client);
	},
};