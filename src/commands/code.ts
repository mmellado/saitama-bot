import dotenv from 'dotenv';

import Discord, {
  CollectorFilter,
  Message,
  TextChannel,
  Role,
  Collection,
} from 'discord.js';
import { CommandPromise } from './types';
import isAdminUser from '../utils/isAdminUser';

dotenv.config();

const code: CommandPromise = async (client, message, args) => {
  if (!isAdminUser(message.member?.roles.cache as Collection<string, Role>)) {
    return;
  }
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

  const replyChannel =
    (client.channels.cache.find(
      (channel: TextChannel) => channel.name === process.env.CODES_CHANNEL
    ) as TextChannel) || message.channel;

  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('New Code!')
    .setDescription(newCode)
    .addFields({ name: 'Rewards', value: reply.first()?.content })
    .setTimestamp();

  replyChannel.send(embed);
};

export default code;
