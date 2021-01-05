import http from 'http';
import dotenv from 'dotenv';
import Discord from 'discord.js';

import events from './events';

dotenv.config();

const client = new Discord.Client();

events.forEach((listener, event) => {
  client.on(event, listener.bind(null, client));
});

client.login(process.env.DISCORD_TOKEN);

// Keep the bot alive on Repl.it
const server = http.createServer((_, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);
