import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { redis } from "../../redis";
import bcrypt from "bcryptjs";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { password, token }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(token);
    if (!userId) {
      return null;
    }
    const user = await User.findOne(userId);
    if (!user) {
      return null;
    }

    await redis.del(token);

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    ctx.req.session!.userId = user.id;

    return user;
  }
}
