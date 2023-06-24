import { gql } from 'apollo-server-express';

export default gql`
    type Category {
        id: Int
        name: String
    }
    type Query {
        categories: [Category]
    }

    type Mutation {
        createCategory(name: String!): Category
        updateCategory(id: Int!, name: String!): Category
        deleteCategory(id: Int!): String
    }
`;