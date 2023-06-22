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
            detail: String
            image: String
            price: Int
        }

        type Query {
            items: [Item]
            item(id: Int!): Item 
        }
    `;

    const resolvers = {
        Query: {
            items: async () => {
                const [rows, fields] = await connection.execute('SELECT * FROM `items`');
                return rows;
            },
            item: async (parent, { id }) => {
                const [rows, fields] = await connection.execute('SELECT * FROM `items` WHERE `id` = ?', [id]);
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
