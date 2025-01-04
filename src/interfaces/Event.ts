import Client from '../client';
import { ChatInputCommandInteraction, ClientEvents } from 'discord.js';
import { Events } from 'distube';

// Client Interfaces
interface Run {
    (client: Client, ...args: any[]);
}

export interface Event{
    name: keyof ClientEvents,
    run: Run;
}

// Distube Interfaces
export interface DisTubeMetadata {
    interaction: ChatInputCommandInteraction<'cached'>;
    messageId?: string;
}

interface DisTubeRun {
    (...args: any[]);
}

export interface DisTubeEvent {
    readonly name: Events;
    run: DisTubeRun;
}
