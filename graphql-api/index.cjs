const { ApolloServer} = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const express = require('express');
const path = require('path');
const fs = require('fs');

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

        type Mutation {
            createItem(name: String!, category_id: Int!, detail: String!, image: Upload!, price: Int!): Item
            updateItem(id: Int!, name: String!, category_id: Int!, detail: String!, image: String!, price: Int!): Item
            deleteItem(id: Int!): Item
            createCategory(name: String!): Category
            updateCategory(id: Int!, name: String!): Category
            deleteCategory(id: Int!): Category
        }
    `;

    const resolvers = {
        Upload: graphqlUploadExpress,

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
        },
        Mutation: {
            createItem: async (parent, { name, category_id, detail, image, price }) => {
                const { createReadStream, filename, mimetype, encoding } = await image;
                const stream = createReadStream();
                const pathName = path.join(__dirname, `/public/image/${filename}`);
                await stream.pipe(fs.createWriteStream(pathName));
                imagePath = `http://localhost:4000/image/${filename}`;

                const [rows, fields] = await connection.execute(
                    `INSERT INTO items (name, category_id, detail, image, price) VALUES (?, ?, ?, ?, ?)`
                    , [name, category_id, detail, imagePath, price]
                );
                const [rows2, fields2] = await connection.execute(
                    `SELECT * FROM items WHERE id = ?`
                    , [rows.insertId]
                );
                return rows2[0];
            },
            updateItem: async (parent, { id, name, category_id, detail, image, price }) => {
                const [rows, fields] = await connection.execute(
                    `UPDATE items SET name = ?, category_id = ?, detail = ?, image = ?, price = ? WHERE id = ?`
                    , [name, category_id, detail, image, price, id]
                );
                const [rows2, fields2] = await connection.execute(
                    `SELECT * FROM items WHERE id = ?`
                    , [id]
                );
                return rows2[0];
            },
            deleteItem: async (parent, { id }) => {
                const [rows, fields] = await connection.execute(
                    `DELETE FROM items WHERE id = ?`
                    , [id]
                );
                const [rows2, fields2] = await connection.execute(
                    `SELECT * FROM items WHERE id = ?`
                    , [id]
                );
                return rows2[0];
            },
            createCategory: async (parent, { name }) => {
                const [rows, fields] = await connection.execute(
                    `INSERT INTO categories (name) VALUES (?)`
                    , [name]
                );
                const [rows2, fields2] = await connection.execute(
                    `SELECT * FROM categories WHERE id = ?`
                    , [rows.insertId]
                );
                return rows2[0];
            },
            updateCategory: async (parent, { id, name }) => {
                const [rows, fields] = await connection.execute(
                    `UPDATE categories SET name = ? WHERE id = ?`
                    , [name, id]
                );
                const [rows2, fields2] = await connection.execute(
                    `SELECT * FROM categories WHERE id = ?`
                    , [id]
                );
                return rows2[0];
            },
            deleteCategory: async (parent, { id }) => {
                const [rows, fields] = await connection.execute(
                    `DELETE FROM categories WHERE id = ?`
                    , [id]
                );
                const [rows2, fields2] = await connection.execute(
                    `SELECT * FROM categories WHERE id = ?`
                    , [id]
                );
                return rows2[0];
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
