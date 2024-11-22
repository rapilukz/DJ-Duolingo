import { CommandInteraction, GuildMember, EmbedBuilder, Colors } from 'discord.js';

export function isVoiceChannel(interaction: CommandInteraction) {
	const user = interaction.member as GuildMember;
	const voiceChannel = user.voice.channel;

	return voiceChannel ? true : false;
}

export function BaseErrorEmbed(description: string) {
	const embed = new EmbedBuilder()
		.setDescription(description)
		.setColor(Colors.Red)
		.setTimestamp();

	return embed;
}