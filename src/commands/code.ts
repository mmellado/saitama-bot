import { CollectorFilter, Message } from 'discord.js';
import { CommandPromise } from './types';

const code: CommandPromise = async (_, message, args) => {
  if (!args?.length) {
    message.channel.send('A code is needed to use this command');
    return;
  }

  const newCode = args[0];

  const filter: CollectorFilter = (response: Message) =>
    response.author.id === message.author.id;

  message.channel.send(`What's this code's reward?`);
  const reply = await message.channel.awaitMessages(filter, {
    max: 1,
    time: 30000,
    errors: ['time'],
  });

  message.channel.send(
    `New Code: **${newCode}**. \n Reward: ${reply.first()?.content}`
  );
};

export default code;
