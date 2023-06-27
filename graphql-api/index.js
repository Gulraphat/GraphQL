import { ApolloServer } from 'apollo-server-express';
import typeDefs from'./src/graphql/typedefs/index.js';
import resolvers from './src/graphql/resolvers/index.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import express from 'express';

const app = express();
app.use('/images/items', express.static('public/images/items'));
app.use('/images/users', express.static('public/images/users'));
app.use(graphqlUploadExpress());

const server = new ApolloServer({
    typeDefs,
    resolvers
});

await server.start()

server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('Welcome to GraphQL API Server. Please go to /graphql to use the API.');
});

app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
});

