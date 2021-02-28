import * as dotenv from 'dotenv';

dotenv.config();

export const dbEnv = {
    dbName: process.env.DB_NAME ?? '',
    dbPassword: process.env.DB_PASSWORD ?? '',
    dbUser: process.env.DB_USER ?? '',
    dbHost: process.env.DB_HOST ?? '',
    dbPort: process.env.DB_PORT ?? '',
};

export const port = process.env.PORT ?? 5000;
export const secret = process.env.SECRET ?? '';
export const environment = process.env.NODE_ENV ?? 'development';
