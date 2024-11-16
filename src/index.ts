import Client from './Client';
import { GatewayIntentBits } from 'discord.js';

new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
}).init();
