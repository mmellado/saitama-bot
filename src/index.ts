import dotenv from 'dotenv';
import Discord from 'discord.js';
import events from '@events/index';

import { CustomClient } from './types';

dotenv.config();
const config = {
  prefix: process.env.prefix || 's!',
};

const client = new Discord.Client() as CustomClient;
client.config = config;
client.commands = new Discord.Collection();

events.forEach((listener, event) => {
  client.on(event, listener.bind(null, client));
});

client.login(process.env.DISCORD_TOKEN);
