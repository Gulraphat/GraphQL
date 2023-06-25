import createKnexConnection from '../../knex.js';
const db = createKnexConnection;

export default {
    Query: {
        orders: async () => {
            const rows = await db('orders').select('*');
            return rows;
        },
        order: async (parent, { id }) => {
            const rows = await db('orders').select('*').where('id', id);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        },
        ordersByBuyer: async (parent, { buyer_id }) => {
            const rows = await db('orders').select('*').where('buyer_id', buyer_id);
            return rows;
        }
    },
    Order: {
        buyer: async (parent) => {
            const rows = await db('users').select('*').where('id', parent.buyer_id).first();
            return rows;
        },
        items: async (parent) => {
            const rows = await db('order_items').select('*').where('order_id', parent.id);
            return rows;
        }
    },
    OrderItem: {
        item: async (parent) => {
            const rows = await db('items').select('*').where('id', parent.item_id).first();
            return rows;
        }
    },
    Item: {
        category: async (parent) => {
            const rows = await db('categories').select('*').where('id', parent.category_id).first();
            return rows;
        },
        seller: async (parent) => {
            const rows = await db('users').select('*').where('id', parent.seller_id).first();
            return rows;
        }
    },
    Mutation: {
        createOrder: async (parent, { buyer_id, items }) => {
            try {
                const rows = await db('orders').insert({ buyer_id: buyer_id });
                const order_id = rows[0];
                for (let i = 0; i < items.length; i++) {
                    await db('order_items').insert({ order_id: order_id, item_id: items[i].item_id, quantity: items[i].quantity });
                }
                return "Create Success";
            } catch (err) {
                return "Create Fail";
            }
        }
    }
}