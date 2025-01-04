import { VoiceState } from 'discord.js';
import { Event } from '../../interfaces';
import ExtendedClient from '../../client';
import { isVoiceChannelEmpty } from 'distube';

export const event: Event = {
	name: 'voiceStateUpdate',
	run: async (client: ExtendedClient, oldState: VoiceState) => {
		if (!oldState?.channel) return;

		const voice = client.distube.voices.get(oldState);
		// If the bot is in a voice channel and the voice channel is empty, leave the voice channel
		if (voice && isVoiceChannelEmpty(oldState)) {
			voice.leave();
		}
	},
};
