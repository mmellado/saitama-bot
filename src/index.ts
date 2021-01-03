import dotenv from 'dotenv';
import Discord from 'discord.js';
import events from '@events/index';
import commands from '@commands/index';

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
