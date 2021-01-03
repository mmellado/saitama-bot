import Discord, { Collection, Message, Snowflake } from 'discord.js';
import { CustomClient } from '../types';

import ping from './ping';

export type Command = Collection<
  Snowflake,
  (client: CustomClient, msg: Message) => void
>;

const commands: Command = new Discord.Collection();

commands.set('ping', ping);

export default commands;
