import {ApolloError, AuthenticationError} from "apollo-server-express";
import {User} from "../models/User";
import {Quiz} from "../models/Quiz";
import {QuizRequest} from "../models/QuizRequest";
import {QuizDone} from "../models/QuizDone";

const {gql} = require('apollo-server');

export const typeDefs = gql`

  type QuizDone {
    _id: ID!
    quizRequest: QuizRequest!
    user: User!
    choice: String!
    challenge: String!
    createdAt: Date!
  }

  extend type Query {
    allDoneQuizzes: [QuizDone!]!
  }
  
  extend type Mutation {
    doneQuiz(requestID: String, choice: String): QuizDone
  }
`;

export const resolvers = {
  QuizDone: {
    user: async ({user}, args, ctx) => {
      return User.findById(user);
    },
    quizRequest: async ({quizRequest}, args, ctx) => {
      return QuizRequest.findById(quizRequest);
    },
  },
  Query: {
    allDoneQuizzes: async (parent, {id}, ctx) => {
      if(!ctx.user){
        throw new AuthenticationError("Invalid token");
      }
      return QuizDone.find({user: ctx.user._id});
    }
  },
  Mutation: {
    doneQuiz: async (parent, {requestID, choice}, ctx) => {
      let user = ctx.user;
      if (!user) {
        throw new ApolloError("User not found");
      }
      let quizRequest = await QuizRequest.findById(requestID);
      if (!quizRequest) {
        throw new ApolloError("QuizRequest not found");
      }
      if(user._id.toString() === quizRequest.user.toString()){
        throw new ApolloError("You can not do yours quiz request");
      }

      if(await QuizDone.findOne({user, quizRequest})){
        throw new ApolloError("Quiz already has been done");
      }

      let quiz = await Quiz.findById(quizRequest.quiz);
      let challenge = quiz.emojis.find(el => el.emoji === choice).desc || null;
      if(challenge === null){
        throw new ApolloError("Wrong choice");
      }
      let quizDone = new QuizDone({quizRequest, user, choice, challenge});
      await quizDone.save();
      return quizDone;
    }
  }
};
