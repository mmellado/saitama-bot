import { Client, Message, GuildMember } from 'discord.js';
import { getServerSettingsFromMessage } from '../controllers/server';
import commands from '../commands';
import parseCommand from '../utils/parseCommand';
import help from '../commands/help';
import isAdminUser from '../utils/isAdminUser';
import isModUser from '../utils/isModUser';

export default async (_client: Client, message: Message): Promise<void> => {
  // Ignore all bots
  try {
    if (message.author.bot) return;

    const settings = await getServerSettingsFromMessage(message);

    const prefix = settings.prefix as string;

    // Ignore messages not starting with the prefix
    if (!message.content.startsWith(prefix)) return;

    const { command, args } = parseCommand(message, prefix);
    // Adding the help command here to avoid a circular dependency
    commands.set('help', {
      permissions: 2,
      description: 'Shows the list of available commands.',
      cb: help,
    });

    if (!command) return;

    const cmd = commands.get(command);
    if (!cmd) return;

    // If user doesn't have the right permissions for the command, don't execute
    if (cmd.permissions === 0 && !isAdminUser(message.member as GuildMember)) {
      return;
    }
    if (
      cmd.permissions === 1 &&
      !isModUser(settings, message.member as GuildMember)
    ) {
      return;
    }

    // Run the command
    cmd.cb(settings, message, args);
  } catch (err) {
    console.error('Error in message.ts', err);
  }
};
