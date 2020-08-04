import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class ChangePasswordInput {
  @Field()
  @Length(1, 255)
  password: string;

  @Field()
  @Length(1, 255)
  token: string;
}
