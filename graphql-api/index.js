const { ApolloServer } = require('apollo-server');

async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'graphql_shop'});
    // query database
    const [rows, fields] = await connection.execute('SELECT * FROM `items`');

    // A schema is a collection of type definitions (hence "typeDefs")
    // that together define the "shape" of queries that are executed against
    // your data.
    const typeDefs = `#graphql
    type Item {
        id: Int
        name: String
        detail: String
        image: String
        price: Int
    }

    type Query {
        items: [Item]
        item(id: Int!): Item 
    }
    
    `;

    // Resolvers define how to fetch the types defined in your schema.
    // This resolver retrieves books from the "books" array above.
    const resolvers = {
        Query: {
            items: async () => {
                const [rows, fields] = await connection.execute('SELECT * FROM `items`');
                return rows;
            }
            ,
            item: async (parent, {id}) => {
                const [rows, fields] = await connection.execute('SELECT * FROM `items` WHERE `id` = ?', [id]);
                if (rows.length > 0) {
                    return rows[0]
                    
                }else{
                    return []
                }
            }
        },
        // Mutation: {
        //     addAttraction: async (parent, {name, detail, coverimage, latitude, longitude}) => {
        //         const [rows, fields] = await connection.execute('INSERT INTO `attractions` (`name`, `detail`, `coverimage`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?)', [name, detail, coverimage, latitude, longitude]);
        //         const [rows2, fields2] = await connection.execute('SELECT * FROM `attractions` WHERE `id` = ?', [rows.insertId]);
        //         if (rows2.length > 0) {
        //             return rows2[0]
        //         }else{
        //             return []
        //         }
        //     }
        // },
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
    server.listen().then({port:4000}, () => {
        console.log(`🚀 Server ready at http://localhost:4000/`);
    });
}

main()