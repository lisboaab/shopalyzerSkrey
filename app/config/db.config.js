import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

const dbConfig = {
  mongodb_uri: process.env.uri,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.PORT,
  secret: process.env.SECRET,
};

export default dbConfig;
