import { Collection, Message, Snowflake } from 'discord.js';
import { CustomClient } from '../types';

export type Command = (
  client: CustomClient,
  msg: Message,
  args?: string[]
) => void;
export type CommandPromise = (
  client: CustomClient,
  msg: Message,
  args?: string[]
) => Promise<void>;

export type CommandCollection = Collection<Snowflake, Command | CommandPromise>;
