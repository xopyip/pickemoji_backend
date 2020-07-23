import {ApolloError, AuthenticationError} from "apollo-server-express";
import {User} from "../models/User";
import {Quiz} from "../models/Quiz";
import {QuizRequest} from "../models/QuizRequest";

const {gql} = require('apollo-server');

export const typeDefs = gql`

  type QuizRequest {
    _id: ID!
    user: User!
    quiz: Quiz!
    createdAt: Date
  }

  extend type Query {
    quizRequest(id: String): QuizRequest
  }
  
  extend type Mutation {
    requestQuiz(quizID: String): QuizRequest
  }
`;

export const resolvers = {
  QuizRequest: {
    user: async ({user}, args, ctx) => {
      return User.findById(user);
    },
    quiz: async ({quiz}, args, ctx) => {
      return Quiz.findById(quiz);
    },
  },
  Query: {
    quizRequest: async (parent, {id}, ctx) => {
      if(!ctx.user){
        throw new AuthenticationError("Invalid token");
      }
      return QuizRequest.findById(id);
    }
  },
  Mutation: {
    requestQuiz: async (parent, {quizID}, ctx) => {
      let user = ctx.user;
      if (!user) {
        throw new ApolloError("User not found");
      }
      let quiz = await Quiz.findById(quizID);
      if (!quiz) {
        throw new ApolloError("Quiz not found");
      }
      if(!quiz.accepted){
        throw new ApolloError("Quiz is not accepted yet");
      }
      let request = new QuizRequest({user, quiz});
      await request.save();
      return request;
    }
  }
};
