import { gql } from 'apollo-server';

export default gql`
    type User {
        id: Int!
        firstName: String!
        lastName: String
        username: String!
        email: String!
        createdAt: String!
        updatedAt: String
    }

    type CreateAccountResult {
        ok: Boolean!
        error: String
    }

    type Query {
        seeProfile(username: String!): User
    }

    type Mutation {
        createAccount(
            firstName: String!
            lastName: String
            username: String!
            email: String!
            password: String!
        ): CreateAccountResult
    }
`;