import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { createForgotPasswordUrl } from "../utils/createForgotPasswordUrl";
import { sendEmail } from "../utils/sendEmail";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return false;
    }

    const url = await createForgotPasswordUrl(user.id);
    sendEmail(email, url);
    return true;
  }
}
