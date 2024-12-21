import 'dotenv/config';
import fs from 'fs';
import {default as Knex} from 'knex';

// Connect to the database
const connectionString = process.env.DATABASE_URL;

// Create a Knex instance to interact with the database
export const knex = Knex({
    client: 'pg',
    connection: {
        connectionString: connectionString,
	ssl: {
		ca: fs.readFileSync('./ca.crt').toString(),
	},
    }
})
