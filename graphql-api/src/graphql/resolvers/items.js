import createKnexConnection from '../../knex.js';
import path from 'path';
import fs from 'fs';
const db = createKnexConnection;

export default {
    Query: {
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
            const rows = await db('categories').select('*').where('id', parent.category_id).first();
            return rows;
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
            try{
                await db('items').delete().where('id', id);
                return "Delete Success";
            }catch(err){
                return "Delete Fail";
            }
        }
    }
}