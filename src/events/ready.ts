import { CustomClient } from '../types';

export default (client: CustomClient): void => {
  if (client?.user) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
};
