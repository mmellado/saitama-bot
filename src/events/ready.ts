import { Client } from 'discord.js';

export default (client: Client): void => {
  if (client?.user) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
};
