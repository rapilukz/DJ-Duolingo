import { Events, Playlist, Queue } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../Interfaces/Event';
import { EmbedBuilder, Colors } from 'discord.js';

export const event: DisTubeEvent = {
	name: Events.ADD_LIST,
	run: async (queue: Queue, playList: Playlist<DisTubeMetadata>) => {
		const user = playList.user?.username as string;

		const botAvatar = playList.metadata.interaction.client.user.displayAvatarURL() as string;
		const interaction = playList.metadata.interaction;
		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setAuthor({
				name: 'Added Playlist to Queue 🎶',
				iconURL: botAvatar,
			})
			.setTitle(`${playList.name}`)
			.setURL(playList.url as string)
			.addFields(
				{ name: '🎶 Songs', value: playList.songs.length.toString(), inline: true },
				{ name: '⏲ Duration', value: playList.formattedDuration || 'Unknown', inline: true },
				{ name: '📚 Queue Length', value: queue.songs.length.toString(), inline: true },
			)
			.setFooter({
				text: 'Added by: ' + user,
			})
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	},
};