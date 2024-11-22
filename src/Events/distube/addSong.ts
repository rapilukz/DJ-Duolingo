import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../Interfaces/Event';
import { EmbedBuilder, Colors } from 'discord.js';

export const event: DisTubeEvent = {
	name: Events.ADD_SONG,
	run: (queue: Queue, song: Song<DisTubeMetadata>) => {
		const user = song.user?.username as string;
		const botAvatar = song.metadata.interaction.client.user.displayAvatarURL() as string;

		song.metadata.interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Green)
					.setAuthor({
						name: 'Added to Queue 🎶',
						iconURL: botAvatar,
					})
					.setTitle(`${song.name} • [${song.formattedDuration}]`)
					.setURL(song.url as string)
					.setDescription(`Queue Length: ${queue.songs.length}`)
					.setFooter({
						text: 'Added by: ' + user,
					})
					.setTimestamp(),
			],
		});

	},
};