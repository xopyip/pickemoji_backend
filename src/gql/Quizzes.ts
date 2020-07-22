import {ApolloError, AuthenticationError} from "apollo-server-express";
import {Category, Category as QuizCategory} from "../models/QuizCategory";
import {Roles} from "../Roles";
import {Quiz} from "../models/Quiz";
import {User} from "../models/User";

const {gql} = require('apollo-server');

export const typeDefs = gql`
  input QuizEmoji {
    emoji: String!
    desc: String!
  }
  type QuizEmojiOut {
    emoji: String!
    desc: String!
  }
  
  type Quiz {
    _id: ID!
    name: String!
    desc: String!
    likes: Int!
    doneCounter: Int!
    author: User!
    category: Category!
    emojis: [QuizEmojiOut]
  }

  extend type Query {
    quizzes: [Quiz!]!
    notAcceptedQuizzes: [Quiz!]!
    quiz(name: String): Quiz
  }
  
  extend type Mutation {
    createQuiz(name: String, desc: String, categoryName: String, emojis: [QuizEmoji]): Quiz
  }
`;

export const resolvers = {
  Quiz: {
    author: async ({author}, args, ctx) => {
      return User.findById(author);
    },
    category: async ({category}, args, ctx) => {
      return Category.findById(category);
    },
  },
  Query: {
    quizzes: (parent, args, ctx) => {
      return Quiz.find({accepted: true});
    },
    notAcceptedQuizzes: (parent, args, ctx) => {
      if(!ctx.user){
        throw new AuthenticationError("Invalid token");
      }
      if(ctx.user.role < Roles.MODERATOR){
        throw new AuthenticationError("You don't have permissions");
      }
      return Quiz.find({accepted: false});
    },
    quiz: (parent, {name}, ctx) => {
      return Quiz.findOne({name});
    },
  },
  Mutation: {
    async createQuiz(parent, {name, desc, categoryName, emojis}, ctx) {
      if(!ctx.user){
        throw new AuthenticationError("Invalid token");
      }
      if(emojis.length >6){
        throw new ApolloError("Emojis list exceeded max amount (6)");
      }
      if(emojis.length < 3){
        throw new ApolloError("Minimum amount of emojis is 3");
      }
      let category = await QuizCategory.findOne({name: categoryName});

      if(!category) {
        throw new ApolloError("Category not found");
      }
      let quiz = new Quiz({name, desc, author: ctx.user._id, category: category._id, emojis});
      await quiz.save();
      return quiz;
    },
  }
};
