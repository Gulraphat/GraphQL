import { gql } from 'apollo-server-express';

export default gql`
    scalar Upload

    type Item {
        id: Int
        name: String
        category: Category
        seller: User
        detail: String
        image: String
        price: Int
    }

    type Query {
        items: [Item]
        item(id: Int!): Item 
    }

    type Mutation {
        createItem(name: String!, category_id: Int!, seller_id: Int!, detail: String!, image: Upload!, price: Int!): String
        deleteItem(id: Int!): String
    }
`;