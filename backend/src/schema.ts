import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
  }

  type Contact {
    id: ID!
    name: String!
    phoneNumber: String!
    birthday: String
    anniversary: String
  }

  type Query {
    me: User
    contacts: [Contact!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, phoneNumber: String!): String!
    login(email: String!, password: String!): String!
    addContact(name: String!, phoneNumber: String!, birthday: String, anniversary: String): Contact!
  }
  
  type MessageTemplate {
      id: ID!
      type: String!
      content: String!
    }
    
    extend type Query {
      messageTemplates: [MessageTemplate!]!
    }
    
    extend type Mutation {
      addMessageTemplate(type: String!, content: String!): MessageTemplate!
      deleteMessageTemplate(id: ID!): Boolean!
      sendTestMessage(phoneNumber: String!, type: String!): Boolean!
    }

`;
