const {ApolloServer, gql} = require('apollo-server');

export const typeDefs = gql`

  type User {
    id: ID!
    username: String!
  }

  type LoggedUser {
    id: ID!
    username: String!
    token: String!
  }

  type Query {
    users: [User!]!
  }
  
  type Mutation {
    register(username: String, password: String): LoggedUser
    login(username: String, password: String): LoggedUser
  }
`;