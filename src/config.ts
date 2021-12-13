import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    postgres: {
      dbName: process.env.POSTGRES_DB,
      dbPort: parseInt(process.env.POSTGRES_PORT, 10),
      dbPassword: process.env.POSTGRES_PASSWORD,
      dbUser: process.env.POSTGRES_USER,
      dbHost: process.env.POSTGRES_HOST,
    },
    apiKey: process.env.API_KEY,
  };
});
