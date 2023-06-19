const { ApolloServer } = require('apollo-server');

async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'graphql'});
    // query database
    const [rows, fields] = await connection.execute('SELECT * FROM `attractions`');

    // A schema is a collection of type definitions (hence "typeDefs")
    // that together define the "shape" of queries that are executed against
    // your data.
    const typeDefs = `#graphql
    type Attraction {
        id: Int
        name: String
        detail: String
        coverimage: String
        latitude: Float
        longitude: Float
    }

    type Query {
        attractions: [Attraction]
        attraction(id: Int!): Attraction 
    }
    `;

    // Resolvers define how to fetch the types defined in your schema.
    // This resolver retrieves books from the "books" array above.
    const resolvers = {
        Query: {
            attractions: async () => {
                const [rows, fields] = await connection.execute('SELECT * FROM `attractions`');
                return rows;
            },
            attractions: async (parent, {id}) => {
                const [rows, fields] = await connection.execute('SELECT * FROM `attractions` WHERE `id` = ?', [id]);
                if (rows.length > 0) {
                    return rows[0];
                }else{
                    return [];
                }
            }
        },
    };

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
    });
    
    // Passing an ApolloServer instance to the `startStandaloneServer` function:
    //  1. creates an Express app
    //  2. installs your ApolloServer instance as middleware
    //  3. prepares your app to handle incoming requests
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

main()