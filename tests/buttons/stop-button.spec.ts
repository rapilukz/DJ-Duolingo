import { button } from '@/buttons/stop';
import { command } from '@/slash-commands/Music/stop';
import ExtendedClient from '@/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockInteraction } from '../mocks/discordMocks';

describe('Stop Button', () => {
	let client: ExtendedClient;

	beforeEach(() => {
		client = new ExtendedClient({ intents: [] });

		client.SlashCommands.set(command.data.name, command);
		command.run = vi.fn();
	});

	it('should have the correct button id', () => {
		expect(button.id).toBe('stop');
	});

	it('should not call the command if it does not exist', async () => {
		client.SlashCommands.get = vi.fn().mockReturnValue(null);

		await button.run(client, mockInteraction);

		expect(client.SlashCommands.get).toHaveBeenCalledWith('stop');
		expect(command.run).not.toHaveBeenCalled();
		expect(mockInteraction.reply).toBeCalledWith({ content: 'Command not found', ephemeral: true });
	});

	it('should call the command run method', async () => {
		client.SlashCommands.get = vi.fn().mockReturnValue(command);

		await button.run(client, mockInteraction);

		expect(client.SlashCommands.get).toHaveBeenCalledWith('stop');
		expect(command.run).toHaveBeenCalledWith(mockInteraction, client);
	});
});
