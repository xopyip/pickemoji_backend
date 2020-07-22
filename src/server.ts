import * as express from "express";
import * as mongoose from "mongoose";
import {typeDefs, resolvers} from "./schema";
import {ApolloServer} from "apollo-server-express";

import * as dotenv from "dotenv";

import * as jwt from "jsonwebtoken";
import {User} from "./models/User";

dotenv.config();

async function startServer(){

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      if(!token) return {};
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(typeof decoded === "object"){
          let user = await User.findById(decoded['user'].id);
          return { user };
        }
      } catch (e) {
        console.error(e);
      }
      return {};
    },
  });

  const PORT = process.env.PORT || 4000;

  await mongoose.connect('mongodb://localhost:32768/pickemoji', {useNewUrlParser: true, useUnifiedTopology: true});

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )

}
startServer();