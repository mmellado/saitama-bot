import { CollectorFilter } from 'discord.js';
import { CommandPromise } from './types';

const code: CommandPromise = async (_, message, args) => {
  console.log(args);

  if (!args) {
    message.channel.send('A code is needed to use this command');
    return;
  }

  const newCode = args[0];

  const filter: CollectorFilter = (response) => {
    console.log(response);
    return true;
  };

  message.channel.send(`What's this code's reward?`);
  const reply = await message.channel.awaitMessages(filter, {
    max: 1,
    time: 30000,
    errors: ['time'],
  });

  console.log(code, reply);
  message.channel.send(`Code: ${newCode}. Reward: ${reply}`);
};

export default code;
