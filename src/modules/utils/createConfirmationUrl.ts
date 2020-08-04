import { v4 } from "uuid";
import { redis } from "../../redis";

export const createConfirmationUrl = async (
  userId: number
): Promise<string> => {
  const token = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 24); // 1 day

  // frontend URL to handle confirmation, it must call mutation to confirm email
  return `${process.env.FRONTEND_URL}/user/confirm/${token}`;
};
