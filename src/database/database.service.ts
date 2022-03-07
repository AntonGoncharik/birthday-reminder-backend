import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  // private readonly pool: mariadb.Pool;
  // constructor(private configService: ConfigService) {
  //   try {
  //     this.pool = mariadb.createPool({
  //       host: config.host,
  //       user: config.user,
  //       password: config.password,
  //       database: config.database,
  //       multipleStatements: config.multipleStatements,
  //       dateStrings: config.dateStrings,
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async query(queryString: string, params: string[] = []): Promise<any> {
  //   try {
  //     const res = await this.pool.query(queryString, [...params]);
  //     delete res.meta;
  //     return res;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async batch(queryString: string, params: string[][] = []): Promise<any> {
  //   try {
  //     const res = await this.pool.batch(queryString, [...params]);
  //     return res;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

// const { Client } = require('pg');
// const client = new Client();
// await client.connect();
// const res = await client.query('SELECT $1::text as message', ['Hello world!']);
// console.log(res.rows[0].message); // Hello world!
// await client.end();

// const { Pool, Client } = require('pg');
// // pools will use environment variables
// // for connection information
// const pool = new Pool();
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });
// // you can also use async/await
// const res = await pool.query('SELECT NOW()');
// await pool.end();

// PGHOST = 'localhost';
// PGUSER = process.env.USER;
// PGDATABASE = process.env.USER;
// PGPASSWORD = null;
// PGPORT = 5432;

// const pool = new Pool({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211,
// });

// const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
// const values = ['brianc', 'brian.m.carlson@gmail.com'];

// // async/await
// try {
//   const res = await client.query(text, values);
//   console.log(res.rows[0]);
//   // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
// } catch (err) {
//   console.log(err.stack);
// }

// const { Client } = require('pg');
// const client = new Client({
//   host: 'my.database-server.com',
//   port: 5334,
//   user: 'database-user',
//   password: 'secretpassword!!',
// });

// const client = new Client();
// client
//   .connect()
//   .then(() => console.log('connected'))
//   .catch((err) => console.error('connection error', err.stack));

// const { Client } = require('pg');
// const client = new Client();
// client.connect();
// client
//   .query('SELECT $1::text as name', ['brianc'])
//   .then((result) => console.log(result))
//   .catch((e) => console.error(e.stack))
//   .then(() => client.end());
