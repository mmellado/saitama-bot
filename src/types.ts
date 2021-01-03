import { Client, Collection, Snowflake, Message } from 'discord.js';

export interface CustomClient extends Client {
  config: {
    prefix: string;
  };
  commands: Collection<
    Snowflake,
    (client: CustomClient, message: Message, args?: string[]) => void
  >;
}

export type Command = (
  client: CustomClient,
  message: Message,
  args?: string[]
) => void;
