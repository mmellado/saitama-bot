import { Collection, Message, Snowflake } from 'discord.js';
import { Settings as ServerSettings } from '../models/server';

export type Command = (
  serverSettings: ServerSettings,
  msg: Message,
  args?: string[]
) => void;

export type CommandPromise = (
  serverSettings: ServerSettings,
  msg: Message,
  args?: string[]
) => Promise<void>;

export type CommandCollection = Collection<Snowflake, Command | CommandPromise>;
