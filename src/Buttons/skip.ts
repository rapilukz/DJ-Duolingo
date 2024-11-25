import { CommandInteraction } from 'discord.js';
import Client from '../Client';
import { Button } from '../Interfaces/Button';

export const button: Button = {
	id: 'skip',
	run: async (client: Client, interaction: CommandInteraction) => {
		const command = client.SlashCommands.get('skip');
		if (!command || !interaction.isCommand()) return interaction.reply({ content: 'Command not found', ephemeral: true });

		command.run(interaction, client);
	},
};
