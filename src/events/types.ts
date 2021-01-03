import { Collection, Message } from 'discord.js';
import { CustomClient } from '../types';

export type EventCollection = Collection<
  'ready' | 'message',
  (client: CustomClient, msg: Message) => void
>;
