// import the gql tagged template function
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    movieCount: Int
    savedMovies: [Movie]
  }

  type Movie {
    movieId: ID!
    releaseDate: String
    description: String
    title: String!
    image: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input MovieInput {
    movieId: ID!
    releaseDate: String
    description: String
    title: String!
    image: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMovie(movieData: MovieInput!): User
    removeMovie(movieId: ID!): User
  }
`;

// export the typeDefs
module.exports = typeDefs;
