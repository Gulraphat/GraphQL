import { gql } from 'apollo-server-express';

export default gql`
    type OrderItem {
        order_id: Int
        item: Item
        quantity: Int
    }
`;