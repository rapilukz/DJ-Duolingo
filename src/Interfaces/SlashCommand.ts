import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionResolvable } from 'discord.js';
import ExtendedClient from '../Client';

export interface Run {
  (interaction: CommandInteraction, client: ExtendedClient);
}

export interface SlashCommand {
  category: string;
  data: SlashCommandBuilder;
  developer?: boolean;
  description: string;
  run: Run;
}
