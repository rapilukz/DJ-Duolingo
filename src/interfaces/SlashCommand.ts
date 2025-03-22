import { SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import ExtendedClient from '../client';

export interface Run {
  (interaction: CommandInteraction, client: ExtendedClient);
}

export interface SlashCommand {
  category: string;
  data: SlashCommandOptionsOnlyBuilder;
  needsVoiceChannel: boolean;
  developer?: boolean;
  description: string;
  run: Run;
}
