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
commands.set('setup', {
  permissions: 0,
  description: "Starts the bot's setup configuration for the server.",
  cb: setup,
});
commands.set('settings', {
  permissions: 0,
  description: 'Displays the list of configured settings for the server.',
  cb: settings,
});

// Mod + Admin
commands.set('code', {
  permissions: 1,
  arguments: '[code]',
  description: 'Helps post a new code to the configured codes channel.',
  cb: code,
});
commands.set('announce', {
  permissions: 1,
  arguments: '[announcement message]',
  description:
    'Helps post an announcement to the configured announcements channel.',
  cb: announce,
});
commands.set('set-nickname', {
  permissions: 1,
  arguments: '[@member] [new nickname]',
  description:
    'Changes the server nickname for the specified user. If no nickname is passed, the nickname is reset.',
  cb: setNickname,
});

// General --  Help is included directly in the message to avoid a circular dependenc
commands.set('ping', {
  permissions: 2,
  description: 'Basic command to test the bot.',
  cb: ping,
});
commands.set('nickname', {
  permissions: 2,
  arguments: '[new nickname]',
  description:
    "Helps update the user's nickname. If no nickname is passed, the nickname is reset.",
  cb: nickname,
});

export default commands;
