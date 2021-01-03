import Discord from 'discord.js';
import { CommandCollection } from './types';

import ping from './ping';
import code from './code';
import nickname from './nickname';
import announce from './announce';

const commands: CommandCollection = new Discord.Collection();

// Admin only
commands.set('code', code);
commands.set('announce', announce);

// General
commands.set('ping', ping);
commands.set('nickname', nickname);

export default commands;
