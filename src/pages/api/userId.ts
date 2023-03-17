import { createUserId } from "../../utils/crypto";

// return an user id
const userId = async (req: any, res: any) => {
  const { username } = JSON.parse(req.body);
  const userId = createUserId(username, Date.now());
  res.status(200).json({ userId });
};

export default userId;
