const checkOwnership = (userId: string): boolean =>
  userId === process.env.OWNER_ID;

export default checkOwnership;
