import {
	Client,
	Collection,
	UserApplicationCommandData,
} from 'discord.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
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

const isDev = process.env.NODE_ENV === 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: isDev ? '.env.dev' : '.env' });

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

	private async SlashCommandHandler() {

		const commandPath = join(__dirname, '..', 'slash-commands');
		const dirs = readdirSync(commandPath);

		for (const dir of dirs) {
			const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.js'));

			for (const file of commands) {
				const filePath = `file://${join(commandPath, dir, file)}`;
				const { command } = await import(filePath);

				this.SlashCommands.set(command.data.name, command);
				this.SlashCommandsArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
		try {
			console.log('Started refreshing application (/) commands.');
			const BOT_ID = process.env.BOT_ID as string;
			if (isDev) {
				const GuildID = process.env.GUILD_ID as string;
				await rest.put(Routes.applicationGuildCommands(BOT_ID as string, GuildID), { body: this.SlashCommandsArray });
			}
			else {
				await rest.put(Routes.applicationCommands(BOT_ID as string), { body: this.SlashCommandsArray });
			}

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (err) {
			console.log(err);
		}
	}

	private async EventHandler() {
		const eventPath = join(__dirname, '..', 'events', 'client');
		const events = readdirSync(eventPath).filter((file) => file.endsWith('.js'));

		events.forEach(async (file) => {
			const filePath = `file://${join(eventPath, file)}`;
			const { event } = await import(filePath);

			this.events.set(event.name, event);
			this.on(event.name, event.run.bind(null, this));
		});
	}

	private async DistubeEventHandler() {
		const eventPath = join(__dirname, '..', 'events', 'distube');
		const events = readdirSync(eventPath).filter((file) => file.endsWith('.js'));

		events.forEach(async (file) => {
			const filePath = `file://${join(eventPath, file)}`;
			const { event } = await import(filePath);

			this.events.set(event.name, event);
			this.distube.on(event.name, event.run.bind(this));
		});
	}

	private async ButtonHandler() {
		const buttonPath = join(__dirname, '..', 'buttons');
		const buttons = readdirSync(buttonPath).filter((file) => file.endsWith('.js'));

		buttons.forEach(async (file) => {
			const filePath = `file://${join(buttonPath, file)}`;
			const { button } = await import(filePath);
			this.buttons.set(button.id, button);
		});
	}

	private async InitHandlers() {
		await this.EventHandler();
		await this.DistubeEventHandler();
		await this.SlashCommandHandler();
		await this.ButtonHandler();
	}

	public async init() {
		this.login(process.env.TOKEN);
		this.InitHandlers();
	}
}

export default ExtendedClient;
