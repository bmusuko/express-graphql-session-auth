import { Resolver, Query, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/IsAuth";
@Resolver()
export class TestResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }
}
