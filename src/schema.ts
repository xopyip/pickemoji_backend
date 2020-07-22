import {typeDefs as AuthTypeDefs, resolvers as AuthResolvers} from "./gql/Auth";
import {typeDefs as CategoriesTypeDefs, resolvers as CategoriesResolvers} from "./gql/Categories";
import {typeDefs as QuizzesTypeDefs, resolvers as QuizzesResolvers} from "./gql/Quizzes";

import {gql} from "apollo-server";

import {merge} from "lodash";

const baseTypeDefs = gql`
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }`;

export const typeDefs = [baseTypeDefs, AuthTypeDefs, CategoriesTypeDefs, QuizzesTypeDefs];
export const resolvers = merge(AuthResolvers, CategoriesResolvers, QuizzesResolvers);