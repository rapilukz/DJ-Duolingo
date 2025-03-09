import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Music/pause';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { mockInteraction, MockQueueOptions, mockMember, noMusicPlayingMockEmbed, createMockQueue } from '../mocks/discordMocks';
import * as utils from '@/utils/functions';


describe('Pause', () => {
	let client: ExtendedClient;
	let mockQueueOptions: MockQueueOptions;
	const permissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });

		mockQueueOptions = {
			playing: true,
			toggleAutoplay: false,
			paused: false,
		};

		vi.clearAllMocks();
	});

	it('should have the correct command data', () => {
		expect(command.category).toBe('Music');
		expect(command.description).toBe('Pauses the player');
		expect(command.data.name).toBe('pause');
		expect(command.needsVoiceChannel).toBe(true);
		expect(command.data.default_member_permissions).toBe(permissions.toString());
	});
});