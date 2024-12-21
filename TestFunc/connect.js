
import pg from 'pg';
import fs from 'fs';
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
	connectionString: connectionString,

	ssl: {
		ca: fs.readFileSync('./ca.crt').toString(),
	},
});
export const connectTest = async () => {
    const client = await pool.connect();
	try {
		const response = await client.query('SELECT * FROM users');
		console.log(response.rows);
	}
    catch (err) {
        console.error('Error executing query', err.message);
    } 
    finally {
		client.release();
	}
    
}