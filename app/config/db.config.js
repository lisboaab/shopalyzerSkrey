import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  uri: process.env.MONGODB_URI,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
};

export default dbConfig;
