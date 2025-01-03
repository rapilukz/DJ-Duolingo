import { CommandInteraction } from 'discord.js';
import { Button } from '../Interfaces/Button';
import Client from '../Client';

export const button: Button = {
	id: 'skip',
	run: async (client: Client, interaction: CommandInteraction) => {
		const command = client.SlashCommands.get('skip');
		if (!command) return interaction.reply({ content: 'Command not found', ephemeral: true });

		command.run(interaction, client);
	},
};
