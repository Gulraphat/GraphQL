import { gql } from 'apollo-server-express';

export default gql`
    type User {
        id: Int
        name: String
        email: String
        password: String
    }

    type Query {
        users: [User]
        user(id: Int!): User
        login(email: String!, password: String!): String
    }

    type Mutation {
        createUser(name: String!, email: String!, password: String!): String
        updateUser(id: Int!, name: String!, email: String!, password: String!): String
        deleteUser(id: Int!): String
    }
`;