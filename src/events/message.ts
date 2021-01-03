import { Message } from 'discord.js';
import { CustomClient } from '../types';

export default (client: CustomClient, message: Message): void => {
  // Ignore all bots
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix
  if (!message.content.startsWith(client.config.prefix)) return;

  // Our standard argument/command name definition.
  // See https://anidiots.guide/v/v12/first-bot/command-with-arguments for details.
  const args = message?.content
    ?.slice(client.config.prefix.length)
    .split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  // Grab the command data from the client.commands Collection
  const cmd = client.commands.get(command);

  if (!cmd) {
    message.reply(
      `**${client.config.prefix}${command}** is not a valid command`
    );
    return;
  }

  // Run the command
  cmd(client, message, args);
};
