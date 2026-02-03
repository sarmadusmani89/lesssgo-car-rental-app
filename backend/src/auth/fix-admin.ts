import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    await client.connect();
    console.log('Connected to DB');

    try {
        // Check tables
        const resTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables:', resTables.rows.map(r => r.table_name));

        const email = 'sarmadusmani598@gmail.com';
        const password = 'Sarmad@175413';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if users table exists
        if (resTables.rows.some(r => r.table_name === 'users')) {
            console.log('Found "users" table (TypeORM). Inserting admin...');

            // Cleanup existing if any (to avoid dups if unique constraint)
            await client.query(`DELETE FROM users WHERE email = $1`, [email]);

            // Insert
            // Note: TypeORM usually uses 'id', 'email', 'password', 'firstName', 'lastName', 'role', 'isVerified'
            // We need to match the columns.
            const insertRes = await client.query(`
                INSERT INTO users ("email", "password", "firstName", "lastName", "role", "isVerified", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                RETURNING id
            `, [email, hashedPassword, 'Sarmad', 'Usmani', 'admin', true]);

            console.log('Admin inserted into "users" table with ID:', insertRes.rows[0].id);

        } else {
            console.error('ERROR: "users" table not found! TypeORM might not have initialized it yet.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

main();
