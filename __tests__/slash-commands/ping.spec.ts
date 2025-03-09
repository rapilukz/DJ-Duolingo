import { it, expect, describe, vi, beforeEach } from 'vitest';
import ExtendedClient from '@/client';
import { command } from '@/slash-commands/Utils/ping';
import { PermissionFlagsBits } from 'discord.js';
import { mockInteraction } from '../mocks/discordMocks';

describe('Ping', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });
		vi.clearAllMocks();
	});

	const premmisions = PermissionFlagsBits.SendMessages;

	it('should have the correct command data', () => {
		expect(command.category).toBe('Util');
		expect(command.description).toBe('Ping the bot');
		expect(command.data.name).toBe('ping');
		expect(command.needsVoiceChannel).toBe(false);
		expect(command.data.default_member_permissions).toBe(
			premmisions.toString(),
		);
	});

	it('should reply with Pong!', async () => {
		await command.run(mockInteraction, client);

		expect(mockInteraction.reply).toHaveBeenCalledWith('Pong!');
	});
});