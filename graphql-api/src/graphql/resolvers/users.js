import createKnexConnection from '../../knex.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import path from 'path';
import { createWriteStream } from 'fs';
const db = createKnexConnection;

export default {
    Upload: GraphQLUpload,
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
        login: async (parent, { username, password }) => {
            const rows = await db('users').select('*').where('username', username).first();
            if (rows) {
                if (rows.password === password) {
                    return "Login Success";
                } else {
                    return "Username or Password Incorrect";
                }
            } else {
                return "Username or Password Incorrect";
            }
        }
    },
    Mutation: {
        createUser: async (parent, { name, email, username, password }) => {
            try{
                if(await db('users').select('*').where('username', username).first()){
                    return "Username already exists";
                }
                if(await db('users').select('*').where('email', email).first()){
                    return "Email already exists";
                }
                await db('users').insert({name: name,email: email, username: username,password: password});
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
            try {
              const { createReadStream, filename, mimetype, encoding } = await image;
              const stream = createReadStream();
              const pathName = path.join(process.cwd(), `public/images/users/${filename}`);
              const writeStream = createWriteStream(pathName);
          
              await new Promise((resolve, reject) => {
                stream.pipe(writeStream)
                  .on('finish', resolve)
                  .on('error', reject);
              });
          
              const imagePath = `http://localhost:4000/images/users/${filename}`;
              await db('users').where('id', id).update({ image: imagePath });
          
              return "Change Success";
            } catch (err) {
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