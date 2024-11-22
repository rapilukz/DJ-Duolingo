import { CommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import ExtendedClient from '../Client';

export const event: Event = {
	name: 'interactionCreate',
	run: async (client: ExtendedClient, interaction: CommandInteraction) => {
		if (interaction.isCommand()) {
			if (!interaction.guild) return interaction.reply('This command can only be used in a server');
			const command = client.SlashCommands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.run(interaction, client);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

	},
};
