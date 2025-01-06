import {
	Client,
	Collection,
	UserApplicationCommandData,
} from 'discord.js';
import path from 'path';
import { readdirSync } from 'fs';
import { Command, SlashCommand } from '../interfaces';
import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

// Distube imports
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YouTubePlugin } from '@distube/youtube';
import { Button } from '../interfaces/Button';

dotenv.config();

class ExtendedClient extends Client {
	public SlashCommands: Collection<string, SlashCommand> = new Collection();
	public SlashCommandsArray: UserApplicationCommandData[] = [];
	public events: Collection<string, Command> = new Collection();
	public buttons: Collection<string, Button> = new Collection();
	public distube = new DisTube(this, {
		plugins: [
			new YouTubePlugin(),
			new SpotifyPlugin(),
			new SoundCloudPlugin(),
		],
		nsfw: true,
		emitAddListWhenCreatingQueue: true,
		emitAddSongWhenCreatingQueue: true,
		joinNewVoiceChannel: true,
		ffmpeg: {
			path: process.env.FFMPEG_PATH,
		},
	});

	private async SlashComamndHandler() {

		const SlashcommandPath = path.join(__dirname, '..', 'slash-commands');
		readdirSync(SlashcommandPath).forEach((dir) => {
			const commands = readdirSync(`${SlashcommandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

			for (const file of commands) {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				const { command } = require(`${SlashcommandPath}/${dir}/${file}`);
				this.SlashCommands.set(command.data.name, command);
				this.SlashCommandsArray.push(command.data.toJSON());
			}
		});

		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
		try {
			console.log('Started refreshing application (/) commands.');

			// Change to Routes.applicationCommands(process.env.BOT_ID as string) if you want to register global commands
			// const GuildID = process.env.GUILD_ID as string;
			// await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, GuildID), { body: this.SlashCommandsArray });
			await rest.put(Routes.applicationCommands(process.env.BOT_ID as string), { body: this.SlashCommandsArray });

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (err) {
			console.log(err);
		}
	}

	private async EventHandler() {
		const eventPath = path.join(__dirname, '..', 'events', 'client');
		readdirSync(eventPath).forEach(async (file) => {
			const { event } = await import(`${eventPath}/${file}`);
			this.events.set(event.name, event);
			this.on(event.name, event.run.bind(null, this));
		});
	}

	private async DistubeEventHandler() {
		const eventPath = path.join(__dirname, '..', 'events', 'distube');
		readdirSync(eventPath).forEach(async (file) => {
			const { event } = await import(`${eventPath}/${file}`);
			this.events.set(event.name, event);
			this.distube.on(event.name, event.run.bind(this));
		});
	}

	private async ButtonHandler() {
		const buttonPath = path.join(__dirname, '..', 'buttons');
		readdirSync(buttonPath).forEach(async (file) => {
			const { button } = await import(`${buttonPath}/${file}`);
			this.buttons.set(button.id, button);
		});
	}

	private async InitHandlers() {
		this.EventHandler();
		this.DistubeEventHandler();
		this.SlashComamndHandler();
		this.ButtonHandler();
	}

	public async init() {
		this.login(process.env.TOKEN);
		this.InitHandlers();
	}
}

export default ExtendedClient;
