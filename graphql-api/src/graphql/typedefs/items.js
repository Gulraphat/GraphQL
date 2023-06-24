import { gql } from 'apollo-server-express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import categories from './categories.js';

export default gql`
    scalar Upload

    type Item {
        id: Int
        name: String
        category: Category
        detail: String
        image: String
        price: Int
    }

    type Query {
        items: [Item]
        item(id: Int!): Item 
    }

    type Mutation {
        createItem(name: String!, category_id: Int!, detail: String!, image: Upload!, price: Int!): Item
        deleteItem(id: Int!): String
    }
`;