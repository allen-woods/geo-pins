const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
  }

  type Pin {
    _id: ID
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }

  type Comment {
    text: String
    author: User
    createdAt: String
    updatedAt: String
  }

  input CreatePinInput {
    title: String
    image: String
    content: String
    latitude: Float
    longitude: Float
  }

  type Query {
    me: User
    getPins: [Pin!]
  }

  type Mutation {
    createPin(input: CreatePinInput!): Pin
  }
`
