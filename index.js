import { ApolloServer } from 'apollo-server-express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import express from 'express';
import path from 'path';
import fs from 'fs';
// import mysql from 'mysql2/promise';
import createKnexConnection from './graphql-api/src/knex.js';

async function main() {
    
    const db = createKnexConnection;

    const app = express();
    app.use('/image', express.static('public/image'));
    app.use(graphqlUploadExpress());

    const typeDefs = `
        scalar Upload

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
            deleteItem(id: Int!): String
            createCategory(name: String!): Category
            updateCategory(id: Int!, name: String!): Category
            deleteCategory(id: Int!): String
        }
    `;

    const resolvers = {

        Query: {
            categories: async () => {
                const rows = await db.select('*').from('categories');
                return rows;

            },
            items: async () => {
                const rows = await db('items').select('*');
                return rows;
            },
            item: async (parent, { id }) => {
                const rows = await db('items').select('*').where('id', id);
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null;
                }
            }
        },
        Item: {
            category: async (parent) => {
                const rows = await db('categories').select('*').where('id', parent.category_id);
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

                const [id] = await db('items').insert({name: name,category_id: category_id, detail: detail,image: imagePath,price: price});
                const rows = await db('items').select('*').where('id', id);
                return rows;
            },
            deleteItem: async (parent, { id }) => {
                const rows = await db('items').delete().where('id', id);
            },
            createCategory: async (parent, { name }) => {
                const [id] = await db.insert({ name: name }).into('categories');
                const rows = await db.select('*').from('categories').where('id', id).first();
                return rows;
            },
            updateCategory: async (parent, { id, name }) => {
                await db('categories').update({ name: name }).where('id', id);
                const rows = await db('categories').select('*').where('id', id).first();
                return rows;
            },
            deleteCategory: async (parent, { id }) => {
                try{
                    await db('categories').delete().where('id', id);
                    return "Delete Success";
                }catch(err){
                    return "Delete Fail";
                }
            }
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,   
    });

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
