import Discord from 'discord.js';
import { CommandCollection } from './types';

import ping from './ping';
import code from './code';
import nickname from './nickname';

const commands: CommandCollection = new Discord.Collection();

commands.set('ping', ping);
commands.set('code', code);
commands.set('nickname', nickname);

export default commands;
