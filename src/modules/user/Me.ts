import { Resolver, Ctx, Query } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    console.log("hi");
    console.log(ctx.req.session);
    return User.findOne(ctx.req.session!.userId);
  }
}