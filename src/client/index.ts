import {
	Client,
	Collection,
	UserApplicationCommandData,
} from 'discord.js';
import path from 'path';
import { readdirSync, readFileSync } from 'fs';
import { Command, SlashCommand } from '../interfaces';
import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Button } from '../interfaces/Button';

// Distube imports
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YouTubePlugin } from '@distube/youtube';
import { YtDlpPlugin } from '@distube/yt-dlp';

const isDev = process.env.NODE_ENV === 'development';
dotenv.config({ path: isDev ? '.env.dev' : '.env' });

class ExtendedClient extends Client {
	public SlashCommands: Collection<string, SlashCommand> = new Collection();
	public SlashCommandsArray: UserApplicationCommandData[] = [];
	public events: Collection<string, Command> = new Collection();
	public buttons: Collection<string, Button> = new Collection();
	public distube = new DisTube(this, {
		plugins: [
			new SoundCloudPlugin(),
			new YouTubePlugin({
				cookies: this.getYtCookies(),
			}),
			new SpotifyPlugin({
				api: {
					clientId: process.env.SPOTIFY_CLIENT_ID,
					clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
				},
			}),
			new YtDlpPlugin({
				update: true,
			}),
		],
		nsfw: true,
		emitAddListWhenCreatingQueue: true,
		emitAddSongWhenCreatingQueue: true,
		joinNewVoiceChannel: true,
		ffmpeg: {
			path: process.env.FFMPEG_PATH,
		},
	});

	private getYtCookies() {
		const cookiesPath = path.join(__dirname, '..', '..', 'yt-cookies.json');
		try {
			const file = readFileSync(cookiesPath);
			const cookies = JSON.parse(file.toString());

			return cookies;
		}
		catch {
			console.log('No cookies found');
			return [];
		}
	}

	private async SlashComamndHandler() {

		const commandPath = path.join(__dirname, '..', 'slash-commands');
		const dirs = readdirSync(commandPath);

		for (const dir of dirs) {
			const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

			for (const file of commands) {
				const { command } = await import(`${commandPath}/${dir}/${file}`);
				this.SlashCommands.set(command.data.name, command);
				this.SlashCommandsArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
		try {
			console.log('Started refreshing application (/) commands.');

			if (isDev) {
				const GuildID = process.env.GUILD_ID as string;
				await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, GuildID), { body: this.SlashCommandsArray });
			}
			else {
				await rest.put(Routes.applicationCommands(process.env.BOT_ID as string), { body: this.SlashCommandsArray });
			}

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
