const { ApolloServer } = require('apollo-server-express');
const express = require('express');

async function main() {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'graphql_shop' });
    const [rows, fields] = await connection.execute('SELECT * FROM `items`');

    const typeDefs = `
        type Item {
            id: Int
            name: String
            category: Category
            detail: String
            image: String
            price: Int
        }
    
        type Category {
            id: Int
            name: String
        }

       type Query {
            categories: [Category]
            items: [Item]
            item(id: Int!): Item 
        }
    `;

    const resolvers = {
        Query: {
            categories: async () => {
                const [rows, fields] = await connection.execute('SELECT * FROM `categories`');
                return rows;
            },
            items: async () => {
                const [rows, fields] = await connection.execute(`SELECT * FROM items` );
                return rows;
            },
            item: async (parent, { id }) => {
                const [rows, fields] = await connection.execute(`SELECT * FROM items WHERE id = ?`, [id]);
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null;
                }
            }
        },
        Item: {
            category: async (parent) => {
                const [rows, fields] = await connection.execute(
                    `SELECT * FROM categories WHERE id = ?`
                    , [parent.category_id]
                );
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null;
                }
            }
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,   
    });

    const app = express();
    app.use('/image', express.static('public/image'));

    await server.start();
    server.applyMiddleware({ app });

    app.get('/', (req, res) => {
        res.send('Welcome to GraphQL API Server. Please go to /graphql to use the API.');
    });

    app.listen(4000, () => {
        console.log(`🚀 Server ready at http://localhost:4000/`);
    });
}

main();
