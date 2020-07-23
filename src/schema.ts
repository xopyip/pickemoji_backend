import {typeDefs as AuthTypeDefs, resolvers as AuthResolvers} from "./gql/Auth";
import {typeDefs as CategoriesTypeDefs, resolvers as CategoriesResolvers} from "./gql/Categories";
import {typeDefs as QuizzesTypeDefs, resolvers as QuizzesResolvers} from "./gql/Quizzes";
import {typeDefs as QuizRequestTypeDefs, resolvers as QuizRequestResolvers} from "./gql/QuizRequest";
import {typeDefs as QuizDoneTypeDefs, resolvers as QuizDoneResolvers} from "./gql/QuizDone";

import {gql} from "apollo-server";

import {merge} from "lodash";
import {GraphQLScalarType, Kind} from "graphql";

const baseTypeDefs = gql`
    scalar Date
    
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }`;

export const typeDefs = [baseTypeDefs, AuthTypeDefs, CategoriesTypeDefs, QuizzesTypeDefs, QuizRequestTypeDefs, QuizDoneTypeDefs];
export const resolvers = merge({

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
}, AuthResolvers, CategoriesResolvers, QuizzesResolvers, QuizRequestResolvers, QuizDoneResolvers);