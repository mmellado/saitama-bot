import { Client, Collection, Message } from 'discord.js';

export type EventCollection = Collection<
  'ready' | 'message',
  (client: Client, msg: Message) => void
>;
