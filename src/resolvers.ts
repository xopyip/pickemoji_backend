import {User} from "./models/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {ApolloError, AuthenticationError} from "apollo-server-express";


export const resolvers = {
  Query: {
    users: (parent, args, ctx) => {
      if(!ctx.user){
        throw new AuthenticationError("Invalid token");
      }
      return User.find();
    },
  },
  Mutation: {
    async register(parent, {username, password}) {
      let user = await User.findOne({
        username
      });
      if (user) {
        throw new ApolloError("User already exists");
      }

      user = new User({
        username,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      return {
        id: user._id,
        username: user.username,
        token: jwt.sign(
          payload,
          process.env.JWT_SECRET, {
            expiresIn: 10000
          }
        )
      };
    },
    async login(parent, {username, password}){
      let user = await User.findOne({username});
      if (!user)
        throw new AuthenticationError("Credentials doesn't match");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new AuthenticationError("Credentials doesn't match");

      const payload = {
        user: {
          id: user.id
        }
      };

      return {
        id: user._id,
        username: user.username,
        token: jwt.sign(
          payload,
          process.env.JWT_SECRET, {
            expiresIn: 3600
          }
        )
      };
    }
  }
};