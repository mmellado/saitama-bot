import { Command } from './types';

const ping: Command = (_server, message) => {
  message.reply('pong');
};

export default ping;
