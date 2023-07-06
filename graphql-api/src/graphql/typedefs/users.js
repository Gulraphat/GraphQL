import { gql } from 'apollo-server-express';

export default gql`
    scalar Upload

    input RegisterInput {
        name: String!
        email: String!
        username: String!
        password: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type User {
        id: Int
        name: String
        email: String
        username: String
        password: String
        image: String
        role: String
        token: String
    }

    type Query {
        users: [User]
        user(id: Int!): User
    }

    type Mutation {
        registerUser(registerInput: RegisterInput): String
        loginUser(loginInput: LoginInput): User
        changePassword(id: Int!, password: String!): String
        changeImage(id: Int!, image: Upload!): String
        changeName(id: Int!, name: String!): String
        changeEmail(id: Int!, email: String!): String
        deleteUser(id: Int!): String
    }
`;