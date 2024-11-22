import { CommandInteraction, GuildMember } from 'discord.js';

export function isVoiceChannel(interaction: CommandInteraction) {
	const user = interaction.member as GuildMember;
	const voiceChannel = user.voice.channel;

	return voiceChannel ? true : false;
}