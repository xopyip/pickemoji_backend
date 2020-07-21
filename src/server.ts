import * as express from "express";
import * as mongoose from "mongoose";
import {typeDefs} from "./typeDefs";
import {resolvers} from "./resolvers";
import {ApolloServer} from "apollo-server-express";

import * as dotenv from "dotenv";
dotenv.config();

async function startServer(){

  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });

  const PORT = process.env.PORT || 4000;

  await mongoose.connect('mongodb://localhost:32768/pickemoji', {useNewUrlParser: true, useUnifiedTopology: true});

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )

}
startServer();