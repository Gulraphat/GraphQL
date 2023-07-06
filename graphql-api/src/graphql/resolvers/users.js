import createKnexConnection from '../../knex.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import path from 'path';
import { createWriteStream } from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        }
    },
    Mutation: {
        registerUser: async (parent, { registerInput: { name, email, username, password } }) => {
            if(await db('users').select('*').where('username', username).first()){
                throw new Error('Username already exists');
            }
            if(await db('users').select('*').where('email', email).first()){
                throw new Error('Email already exists');
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            await db('users').insert({name: name,email: email, username: username,password: encryptedPassword});
            return "Create Success";
        },
        loginUser: async (parent, { loginInput: { username, password } }) => {
            const rows = await db('users').select('*').where('username', username).first();
            if (rows && await bcrypt.compare(password, rows.password)) {
                const token = jwt.sign({ id: rows.id, username: rows.username }, 'secret');
                await db('users').update({ token: token }).where('id', rows.id);
                rows.token = token;
                return rows;
            } else {
                throw new Error('Invalid username or password');
            }
        },
        changePassword: async (parent, { id, password }) => {
            try{
                const encryptedPassword = await bcrypt.hash(password, 10);
                await db('users').update({password: encryptedPassword}).where('id', id);
                return "Change Success";
            }catch(err){
                return err;
            }
        },
        changeImage: async (parent, { id, image }) => {
            try{
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
            }catch(err){
                return err;
            }
          },
        changeEmail: async (parent, { id, email }) => {
            const emailExist = await db('users').select('*').where('email', email).first();
            if(emailExist){
                    throw new Error('Email already exists')
            }
            await db('users').update({email: email}).where('id', id);
            return "Change Success";
        },
        deleteUser: async (parent, { id }) => {
            const rows = await db('users').select('*').where('username', username).first();
            if(rows){
                await db('users').delete().where('id', id);
                return "Delete Success";
            }else{
                throw new Error('User not found');
            }
        }
    }
}