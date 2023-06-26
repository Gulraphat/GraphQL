import { gql } from 'apollo-server-express';

export default gql`
    type Order {
        id: Int
        buyer: User
        items: [OrderItem]
        total_price: Int
    }

    type Query {
        orders: [Order]
        order(id: Int!): Order
        ordersByBuyer(buyer_id: Int!): [Order]
    }

    type Mutation {
        createOrder(buyer_id: Int!, items: [InputOrderItem!]!, ): String
      }
      
    input InputOrderItem {
        item_id: Int!
        quantity: Int!
    }
`;
