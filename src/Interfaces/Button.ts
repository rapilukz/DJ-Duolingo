import { CommandInteraction } from 'discord.js';
import Client from '../Client';
export interface Button {
    id: string;
    run: ButtonRun;
}

interface ButtonRun {
    (client: Client, interaction: CommandInteraction);
}
