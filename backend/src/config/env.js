import 'dotenv/config';

const required = ['MONGODB_URI'];

for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}

export const env = {
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
};
