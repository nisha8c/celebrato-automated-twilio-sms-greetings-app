import { gql } from "apollo-server-express";

export const typeDefs = gql`
  # -----------------------
  # User Type
  # -----------------------
  type User {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
  }

  # -----------------------
  # Contact Type
  # -----------------------
  type Contact {
    id: ID!
    name: String!
    phoneNumber: String!
    birthday: String
    anniversary: String
  }

  # -----------------------
  # Message Template Type
  # -----------------------
  type MessageTemplate {
    id: ID!
    type: String!
    content: String!
    design: String!
  }

  # -----------------------
  # Queries
  # -----------------------
  type Query {
    me: User
    contacts: [Contact!]!
    messageTemplates: [MessageTemplate!]!
  }

  # -----------------------
  # Mutations
  # -----------------------
  type Mutation {
    # Auth
    register(
      name: String!
      email: String!
      password: String!
      phoneNumber: String!
    ): String!

    login(email: String!, password: String!): String!

    # Contacts
    addContact(
      name: String!
      phoneNumber: String!
      birthday: String
      anniversary: String
    ): Contact!

    updateContact(
      id: ID!
      name: String!
      phoneNumber: String!
      birthday: String
      anniversary: String
    ): Contact!

    deleteContact(id: ID!): Boolean!

    # Message Templates
    addMessageTemplate(
      type: String!
      content: String!
      design: String!
    ): MessageTemplate!

    updateMessageTemplate(
      id: ID!
      content: String!
      design: String!
    ): MessageTemplate!

    deleteMessageTemplate(id: ID!): Boolean!

    # Utility (Send test SMS)
    sendTestMessage(phoneNumber: String!, type: String!): Boolean!
  }
`;
