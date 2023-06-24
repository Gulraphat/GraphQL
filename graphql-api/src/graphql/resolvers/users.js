import createKnexConnection from '../../knex.js';
const db = createKnexConnection;

export default {
    Query: {
        users: async () => {
            const rows = await db('users').select('*');
            return rows;
        },
        user: async (parent, { id }) => {
            const rows = await db('users').select('*').where('id', id);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        },
        login: async (parent, { email, password }) => {
            const rows = await db('users').select('*').where('email', email).first();
            if (rows) {
                if (rows.password === password) {
                    return "Login Success";
                } else {
                    return "Email or Password Incorrect";
                }
            } else {
                return "Email or Password Incorrect";
            }
        }
    },
    Mutation: {
        createUser: async (parent, { name, email, password }) => {
            try{
                if(await db('users').select('*').where('email', email).first()){
                    return "Email already exists";
                }
                await db('users').insert({name: name,email: email,password: password});
                return "Create Success";
            }catch(err){
                return "Create Fail";
            }
        },
        updateUser: async (parent, { id, name, email, password }) => {
            try{
                if(await db('users').select('*').where('email', email).first()){
                    return "Email already exists";
                }
                await db('users').update({ name: name,email: email,password: password }).where('id', id);
                return "Update Success";
            }catch(err){
                return "Update Fail";
            }
        },
        deleteUser: async (parent, { id }) => {
            try{
                await db('users').delete().where('id', id);
                return "Delete Success";
            }catch(err){
                return "Delete Fail";
            }
        }
    }
}