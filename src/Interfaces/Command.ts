import Client from '../Client';
import { Message, PermissionResolvable } from 'discord.js';

interface Run {
  (client: Client, message: Message, args: unknown[]);
}

export interface Command {
  name: string;
  category: string;
  cooldown: number;
  permissions?: PermissionResolvable[];
  developer?: boolean;
  description: string;
  run: Run;
}
