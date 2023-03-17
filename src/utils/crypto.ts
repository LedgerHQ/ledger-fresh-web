import { randomBytes, createHash } from "node:crypto";

export const generateChallenge = (): Buffer => randomBytes(64);

/**
 * @TODO DON'T USE THIS FUNCTION IN PRODUCTION. The user id should be generated server-side
 * in a secure way
 */
export const createUserId = (username: string, salt: number): string => {
  const hash = createHash("sha256");
  hash.update(username);
  hash.update(`${salt}`);
  return hash.copy().digest("hex");
};
