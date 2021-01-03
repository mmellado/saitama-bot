import Discord from 'discord.js';

import { EventCollection } from './types';
import ready from './ready';
import message from './message';

const events: EventCollection = new Discord.Collection();

events.set('ready', ready);
events.set('message', message);

export default events;
