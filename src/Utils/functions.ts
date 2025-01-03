import { CommandInteraction, GuildMember, EmbedBuilder, Colors } from 'discord.js';
import ExtendedClient from '../Client';

export function isVoiceChannel(interaction: CommandInteraction) {
	const user = interaction.member as GuildMember;
	const voiceChannel = user.voice.channel;

	return voiceChannel ? true : false;
}

export function existQueue(guildId: string, client: ExtendedClient) {
	const queue = client.distube.getQueue(guildId);
	return !queue || !queue.playing;
}

export function BaseErrorEmbed(description: string) {
	const embed = new EmbedBuilder()
		.setDescription(description)
		.setColor(Colors.Red)
		.setTimestamp();

	return embed;
}

export function BaseSuccessEmbed(description: string) {
	const embed = new EmbedBuilder()
		.setDescription(description)
		.setColor(Colors.Green)
		.setTimestamp();

	return embed;
}