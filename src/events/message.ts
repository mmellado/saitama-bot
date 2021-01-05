import { Client, Message } from 'discord.js';
import { getServerSettingsFromMessage } from '../controllers/server';
import commands from '../commands';

export default async (_client: Client, message: Message): Promise<void> => {
  // Ignore all bots
  try {
    if (message.author.bot) return;

    const settings = await getServerSettingsFromMessage(message);

    const prefix = settings.prefix as string;

    if (!message.content.startsWith(prefix)) return;
    // Ignore messages not starting with the prefix

    // Our standard argument/command name definition.
    // See https://anidiots.guide/v/v12/first-bot/command-with-arguments for details.
    const args = message?.content?.slice(prefix.length).split(/ +/g);
    const command = args.shift()?.toLowerCase();

    if (!command) return;

    // Grab the command data from the client.commands Collection
    const commandCb = commands.get(command);

    if (!commandCb) return;

    // Run the command
    commandCb(settings, message, args);
  } catch (err) {
    console.error('Error in message.ts', err);
  }
};
