import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Event } from '../../Interfaces';
import ExtendedClient from '../../Client';

export const event: Event = {
	name: 'interactionCreate',
	run: async (client: ExtendedClient, interaction: CommandInteraction) => {
		if (interaction.isCommand()) {
			handleCommands(client, interaction);
		}

		if (interaction.isButton()) {
			handleButtons(client, interaction);
		}
	},
};

async function handleCommands(client: ExtendedClient, interaction: CommandInteraction) {
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

async function handleButtons(client: ExtendedClient, interaction: ButtonInteraction) {
	const button = client.buttons.get(interaction.customId);
	if (!button) return;

	try {
		await button.run(client, interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
	}
}