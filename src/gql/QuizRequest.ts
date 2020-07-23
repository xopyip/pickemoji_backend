import {ApolloError, AuthenticationError} from "apollo-server-express";
import {User} from "../models/User";
import {Quiz} from "../models/Quiz";
import {QuizRequest} from "../models/QuizRequest";
import {QuizDone} from "../models/QuizDone";

const {gql} = require('apollo-server');

export const typeDefs = gql`

    type QuizRequest {
        _id: ID!
        user: User!
        quiz: Quiz!
        createdAt: Date
        done: [QuizDone!]
    }

    extend type Query {
        quizRequest(id: String): QuizRequest
        requestResults(id: String): [QuizDone!]!
        myRequests: [QuizRequest!]!
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
    done: async ({_id, user}, args, ctx) => {
      if(!ctx.user || ctx.user._id.toString() !== user.toString()){
        return null;
      }
      return QuizDone.find({quizRequest: _id});
    }
  },
  Query: {
    quizRequest: async (parent, {id}, ctx) => {
      return QuizRequest.findById(id);
    },
    myRequests: async (parent, args, ctx) => {
      if (!ctx.user) {
        throw new AuthenticationError("Invalid token");
      }
      return QuizRequest.find({user: ctx.user._id});
    },
    requestResults: async (parent, {id}, ctx) => {
      return QuizDone.find({quizRequest: id});
    },
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
      if (!quiz.accepted) {
        throw new ApolloError("Quiz is not accepted yet");
      }
      let prevReq = await QuizRequest.findOne({user, quiz});
      if (prevReq) {
        return prevReq;
      }
      let request = new QuizRequest({user, quiz});
      await request.save();
      return request;
    }
  }
};
