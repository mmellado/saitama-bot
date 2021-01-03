import { Command } from './types';

const ping: Command = (_, message) => {
  //   const msg = message.channel.send('Ping?');
  //   msg.edit(
  //     `Pong! Latency is ${
  //       msg.createdTimestamp - message.createdTimestamp
  //     }ms. API Latency is ${Math.round(client.ping)}ms`
  //   );
  message.reply('pong');
};

export default ping;
