# 🎧 DJ Duolingo
A feature-rich Discord music bot built with Discord.js and DisTube, providing seamless music playback experience in your Discord server.

## 🎵 Features

- **Music Playback**: Play music from YouTube, Spotify, and other supported platforms
- **Queue Management**: Add, remove, and reorder songs in the queue
- **Audio Controls**: Pause, resume and skip.
- **Autoplay Mode**: Automatically play related tracks when the queue ends
- **Voice Channel Integration**: Automatically joins your voice channel
- **Slash Command Support**: Modern Discord slash command integration

## 📋 Installation

### Prerequisites

- Node.js (v22 or higher)
- Discord.js v14
- Discord Bot Token
- FFmpeg installed on your system

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/DJ-Duolingo.git
   cd DJ-Duolingo

2. Install dependencies:
    ```bash
    pnpm install

3. Create a .env file in the root directory with the following variables:
    ```bash
    TOKEN=your_discord_bot_token
    BOT_ID=your_bot_id
    GUILD_ID=your_dev_guild_id
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_secret
    FFMPEG_PATH=/path/to/ffmpeg

4. Start the bot
    ```bash
    pnpm start ## This one runs the normal .env file
    pnpm start:dev ## This one runs the .env.dev file and slash commands are automatically loaded into dev guild

## 🎮 Commands

### Music Commands

- `/play [song]`: Play a song or add it to the queue  
- `/pause`: Pause the current song  
- `/resume`: Resume playback  
- `/skip`: Skip to the next song  
- `/queue`: Display the current song queue  
- `/autoplay`: Toggle autoplay mode on/off  
- `/shuffle`: Shuffle the current queue  
- `/stop`: Stop playback and clear the queue  
- `/seek [position]`: Jump to a specific position in the current song  

### Voice Channel Commands

- `/join`: Join your current voice channel
- `/leave`: Leave the voice channel

### 🛠️ Technologies Used

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [Distube](https://distube.js.org/) - Discord music bot framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Vitest](https://vitest.dev/) - Testing framework

### 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

### ⚠️ Disclaimer
This bot is not affiliated with Duolingo Inc. The name is used for fun purposes only.