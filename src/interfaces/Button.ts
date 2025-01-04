import { CommandInteraction } from 'discord.js';
import Client from '../client';
export interface Button {
    id: string;
    run: ButtonRun;
}

interface ButtonRun {
    (client: Client, interaction: CommandInteraction);
}
