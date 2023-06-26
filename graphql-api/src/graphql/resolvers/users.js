import createKnexConnection from '../../knex.js';
import path from 'path';
import fs from 'fs';
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
        changePassword: async (parent, { id, password }) => {
            try{
                await db('users').update({password: password}).where('id', id);
                return "Change Success";
            }catch(err){
                return "Change Fail";
            }
        },
        changeImage: async (parent, { id, image }) => {
            try{
                const { createReadStream, filename, mimetype, encoding } = await image;
                const stream = createReadStream();
                const pathName = path.join(__dirname, `/public/images/users/${filename}`);
                await stream.pipe(fs.createWriteStream(pathName));
                imagePath = `http://localhost:4000/images/users/${filename}`;

                await db.users.update({image: imagePath}).where('id', id);
                return "Change Success";
            }catch(err){
                return "Change Fail";
            }
        },
        changeName: async (parent, { id, name }) => {
            try{
                await db('users').update({name: name}).where('id', id);
                return "Change Success";
            }catch(err){
                return "Change Fail";
            }
        },
        changeEmail: async (parent, { id, email }) => {
            try{
                if(await db('users').select('*').where('email', email).first()){
                    return "Email already exists";
                }
                await db('users').update({email: email}).where('id', id);
                return "Change Success";
            }catch(err){
                return "Change Fail";
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