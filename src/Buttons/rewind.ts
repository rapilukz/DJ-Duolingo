import { CommandInteraction } from 'discord.js';
import Client from '../client';
import { Button } from '../interfaces/Button';

export const button: Button = {
	id: 'rewind',
	run: async (client: Client, interaction: CommandInteraction) => {
		const command = client.SlashCommands.get('rewind');

		if (!command) return interaction.reply({ content: 'Command not found', ephemeral: true });

		command.run(interaction, client);
	},
};
