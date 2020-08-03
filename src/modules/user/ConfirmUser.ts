import { Resolver, Mutation, Arg } from "type-graphql";
import { redis } from "../../redis";
import { User } from "../../entity/User";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<Boolean> {
    const userId = await redis.get(token);
    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId) }, { confirmed: true });
    await redis.del(token);
    return true;
  }
}
