import { Message } from 'discord.js';

type ParsedCommand = {
  command: string;
  args?: string[];
};

const parseCommand = (message: Message, prefix: string): ParsedCommand => {
  // See https://anidiots.guide/v/v12/first-bot/command-with-arguments for details.
  const args = message.content.slice(prefix.length).split(/ +/g);
  const command = args.shift()?.toLowerCase() || '';
  return { command, args };
};

export default parseCommand;
