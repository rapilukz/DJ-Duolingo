import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionResolvable } from 'discord.js';

export interface Run {
  (interaction: CommandInteraction);
}

export interface SlashCommand {
  category: string;
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  developer?: boolean;
  description: string;
  run: Run;
}
