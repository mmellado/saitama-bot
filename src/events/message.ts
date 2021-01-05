import { Client, Message } from 'discord.js';
import { getServerSettingsFromMessage } from '../controllers/server';
import commands from '../commands';
import parseCommand from '../utils/parseCommand';
import help from '../commands/help';

export default async (_client: Client, message: Message): Promise<void> => {
  // Ignore all bots
  try {
    if (message.author.bot) return;

    const settings = await getServerSettingsFromMessage(message);

    const prefix = settings.prefix as string;

    // Ignore messages not starting with the prefix
    if (!message.content.startsWith(prefix)) return;

    const { command, args } = parseCommand(message, prefix);
    commands.set('help', {
      permissions: 2,
      description: 'Shows the list of available commands.',
      cb: help,
    });

    if (!command) return;

    const cmd = commands.get(command);
    if (!cmd) return;

    // Run the command
    cmd.cb(settings, message, args);
  } catch (err) {
    console.error('Error in message.ts', err);
  }
};
