import {ApolloError, AuthenticationError} from "apollo-server-express";
import {Category} from "../models/QuizCategory";
import {Roles} from "../Roles";
import {Quiz} from "../models/Quiz";

const {gql} = require('apollo-server');

export const typeDefs = gql`
  type Category {
    _id: ID!
    name: String!
    icon: String!
    createdAt: Date
    quizzes: [Quiz!]!
  }

  extend type Query {
    categories: [Category!]!
    category(name: String): Category
  }
  
  extend type Mutation {
    createCategory(name: String, icon: String): Category
  }
`;

export const resolvers = {
  Category:{
    quizzes: async (parent, args, ctx) => {
      return Quiz.find({accepted: true, category: parent._id});
    },
  },
  Query: {
    categories: (parent, args, ctx) => {
      return Category.find();
    },
    category: (parent, {name}, ctx) => {
      return Category.findOne({name});
    },
  },
  Mutation: {
    async createCategory(parent, {name, icon}, ctx) {
      if(!ctx.user){
        throw new AuthenticationError("Invalid token");
      }
      if(ctx.user.role < Roles.ADMIN){
        throw new AuthenticationError("You don't have permissions");
      }
      if(await Category.findOne({name})){
        throw new ApolloError("Category already exists");
      }
      let category = new Category({name, icon});
      await category.save();
      return category;
    },
  }
};
