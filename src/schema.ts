import {typeDefs as AuthTypeDefs, resolvers as AuthResolvers} from "./gql/Auth";
import {typeDefs as CategoriesTypeDefs, resolvers as CategoriesResolvers} from "./gql/Categories";

import {gql} from "apollo-server";

import {merge} from "lodash";

const baseTypeDefs = gql`
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }`;

export const typeDefs = [baseTypeDefs, AuthTypeDefs, CategoriesTypeDefs];
export const resolvers = merge(AuthResolvers, CategoriesResolvers);