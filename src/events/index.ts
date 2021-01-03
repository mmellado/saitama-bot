import Discord, { Collection, Message } from 'discord.js';
import { CustomClient } from '../types';

import ready from './ready';
import message from './message';

const events: Collection<
  'ready' | 'message',
  (client: CustomClient, msg: Message) => void
> = new Discord.Collection();

events.set('ready', ready);
events.set('message', message);

export default events;
