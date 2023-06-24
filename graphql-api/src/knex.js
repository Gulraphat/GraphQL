import knex from 'knex';

const createKnexConnection = knex({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      database: 'graphql_shop'
    }
  });
  
export default createKnexConnection;