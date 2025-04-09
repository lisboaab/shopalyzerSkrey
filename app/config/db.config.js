import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

if (!process.env.MONGODB_URI) console.error("Error: MONGODB_URI is not defined in .env file");
if (!process.env.DB_USER) console.error("Error: DB_USER is not defined in .env file");
if (!process.env.DB_PASSWORD) console.error("Error: DB_PASSWORD is not defined in .env file");
if (!process.env.DB_NAME) console.error("Error: DB_NAME is not defined in .env file");
if (!process.env.DB_HOST) console.error("Error: DB_HOST is not defined in .env file");

const dbConfig = {
  uri: process.env.MONGODB_URI,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
};

export default dbConfig;
