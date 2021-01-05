import Discord from 'discord.js';
import { CommandCollection } from './types';

import ping from './ping';
import code from './code';
import nickname from './nickname';
import announce from './announce';
import setup from './setup';
import settings from './settings';
import setNickname from './setNickname';

const commands: CommandCollection = new Discord.Collection();

// Admin only
commands.set('setup', { permissions: 0, description: '', cb: setup });
commands.set('settings', {
  permissions: 0,
  description: '',
  cb: settings,
});

// Mod + Admin
commands.set('code', { permissions: 1, description: '', cb: code });
commands.set('announce', { permissions: 1, description: '', cb: announce });
commands.set('set-nickname', {
  permissions: 1,
  description: '',
  cb: setNickname,
});

// General
commands.set('ping', { permissions: 2, description: '', cb: ping });
commands.set('nickname', { permissions: 2, description: '', cb: nickname });

export default commands;
