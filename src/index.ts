import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import session from "express-session";
import dotenv from "dotenv";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { MyContext } from "./types/MyContext";

dotenv.config();

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: MyContext) => ({ req, res }),
  });

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_URL,
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: process.env.SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server has started at port 4000");
  });
};

main();
