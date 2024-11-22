import { VoiceState } from 'discord.js';
import { Event } from '../../Interfaces';
import ExtendedClient from '../../Client';
import { isVoiceChannelEmpty } from 'distube';

export const event: Event = {
	name: 'voiceStateUpdate',
	run: async (client: ExtendedClient, oldState: VoiceState, newState: VoiceState) => {
		if (!oldState?.channel) return;

		const voice = client.distube.voices.get(oldState);
		if (voice && isVoiceChannelEmpty(oldState)) {
			voice.leave();
		}
	},
};
