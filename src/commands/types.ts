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

type CommandCallback = Command | CommandPromise;

export type CommandData = {
  permissions: 0 | 1 | 2;
  arguments?: string;
  description: string;
  cb: CommandCallback;
};

export type CommandCollection = Collection<Snowflake, CommandData>;
