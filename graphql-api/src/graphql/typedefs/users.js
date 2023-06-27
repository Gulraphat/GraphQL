import { gql } from 'apollo-server-express';

export default gql`
    scalar Upload

    type User {
        id: Int
        name: String
        email: String
        username: String
        password: String
        image: String
        role: String
    }

    type Query {
        users: [User]
        user(id: Int!): User
        login(username: String!, password: String!): String
    }

    type Mutation {
        createUser(name: String!, email: String!, username: String!, password: String!): String
        changePassword(id: Int!, password: String!): String
        changeImage(id: Int!, image: Upload!): String
        changeName(id: Int!, name: String!): String
        changeEmail(id: Int!, email: String!): String
        deleteUser(id: Int!): String
    }
`;