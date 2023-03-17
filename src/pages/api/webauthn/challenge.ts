import { generateChallenge } from "../../../utils/crypto";

// return a random 64-characters string
const challenge = async (_: any, res: any) => {
  const challenge = generateChallenge();
  res.status(200).send(challenge);
};

export default challenge;
