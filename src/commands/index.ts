import Discord from 'discord.js';
import { CommandCollection } from './types';

import ping from './ping';
import code from './code';

const commands: CommandCollection = new Discord.Collection();

commands.set('ping', ping);
commands.set('code', code);

export default commands;
