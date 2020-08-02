import { Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();
    return user;
  }
}
