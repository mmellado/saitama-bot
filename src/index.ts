import http from 'http';
import dotenv from 'dotenv';
import Discord from 'discord.js';

import events from './events';
import commands from './commands';
import { CustomClient } from './types';

dotenv.config();
const config = {
  prefix: process.env.prefix || 's!',
};

const client = new Discord.Client() as CustomClient;
client.config = config;
client.commands = commands;

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
