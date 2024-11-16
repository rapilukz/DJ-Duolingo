import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import ExtendedClient from '../../Client';

export const command: SlashCommand = {
    category: 'Util',
    description: 'Test Command',
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    run: async (interaction: CommandInteraction, client: ExtendedClient) => {
        interaction.reply('Pong!');
        console.log(client)
    }
}