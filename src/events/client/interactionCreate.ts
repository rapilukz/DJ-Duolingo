import { BaseInteraction, ButtonInteraction, CommandInteraction } from 'discord.js';
import { Event } from '../../interfaces';
import ExtendedClient from '../../client';
import logger from '../../utils/logger';
import { isVoiceChannel } from '../../utils/functions';

export const event: Event = {
	name: 'interactionCreate',
	run: async (client: ExtendedClient, interaction: BaseInteraction) => {
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

	if (command.needsVoiceChannel && !isVoiceChannel(interaction)) {
		return interaction.reply('You need to be in a voice channel to use this command!');
	}

	try {
		await command.run(interaction, client);
	}
	catch (error) {
		logger.error('Error while executing command:', { error, commandName: interaction.commandName });
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

async function handleButtons(client: ExtendedClient, interaction: ButtonInteraction) {
	const button = client.buttons.get(interaction.customId);
	if (!button) return;

	try {
		await button.run(client, interaction as unknown as CommandInteraction);
	}
	catch (error) {
		logger.error('Error while executing button:', { error, buttoId: interaction.customId });
		await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
	}
}