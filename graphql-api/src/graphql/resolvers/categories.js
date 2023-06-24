import createKnexConnection from '../../knex.js';
const db = createKnexConnection;

export default {
    Query: {
        categories: async () => {
            const rows = await db.select('*').from('categories');
            return rows;

        }
    },
    Mutation: {
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
