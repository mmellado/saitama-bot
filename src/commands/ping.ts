import { Message } from 'discord.js';
import { CustomClient } from '../types';

const ping = (_: CustomClient, message: Message): void => {
  //   const msg = message.channel.send('Ping?');
  //   msg.edit(
  //     `Pong! Latency is ${
  //       msg.createdTimestamp - message.createdTimestamp
  //     }ms. API Latency is ${Math.round(client.ping)}ms`
  //   );
  message.reply('pong');
};

export default ping;
