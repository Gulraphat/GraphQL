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
            try{
                await db.insert({ name: name }).into('categories');
                return "Create Success";
            }catch(err){
                return "Create Fail";
            }
        },
        updateCategory: async (parent, { id, name }) => {
            try{
                await db('categories').update({ name: name }).where('id', id);
                return "Update Success";
            }catch(err){
                return "Update Fail";
            }
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
