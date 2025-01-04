import { Events, Queue, Song } from 'distube';
import { DisTubeEvent, DisTubeMetadata } from '../../interfaces/Event';
import { EmbedBuilder, Colors, userMention, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ActionRowBuilder } from '@discordjs/builders';

export const event: DisTubeEvent = {
	name: Events.PLAY_SONG,
	run: async (queue: Queue, song: Song<DisTubeMetadata>) => {
		const interaction = song.metadata.interaction;

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Now Playing', iconURL: queue.client.user?.displayAvatarURL() || undefined })
			.setTitle(song.name || 'Unknown Song')
			.setURL(song.url || '')
			.setThumbnail(song.thumbnail || '')
			.addFields(
				{ name: 'Duration', value: song.formattedDuration || 'Unknown', inline: true },
				{ name: 'Requested By', value: userMention(song.user?.id || '') || 'Unknown', inline: true },
			)
			.setFooter({ text: `Song By: ${song.uploader?.name || 'Unknown'}` })
			.setColor(Colors.Green)
			.setTimestamp();

		// Create buttons for actions
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId('queue').setLabel('QUEUE').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('back').setLabel('BACK').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('pause-resume').setLabel('PAUSE/RESUME').setStyle(ButtonStyle.Secondary),
			new ButtonBuilder().setCustomId('skip').setLabel('SKIP').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('autoplay').setLabel('AUTOPLAY').setStyle(ButtonStyle.Success),
		);

		const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId('loop').setLabel('LOOP').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('rewind').setLabel('REWIND').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('stop').setLabel('STOP').setStyle(ButtonStyle.Danger),
			new ButtonBuilder().setCustomId('fast-forward').setLabel('FORWARD').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('replay').setLabel('REPLAY').setStyle(ButtonStyle.Success),
		);

		const message = await interaction.channel?.send({ embeds: [embed], components: [row, row2] });

		// Save the message id to delete it later
		if (message) {
			song.metadata.messageId = message.id;
		}
	},
};