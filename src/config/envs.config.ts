import { z } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  PORT: z.preprocess((value) => Number(value), z.number().default(3000)),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  JWT_SECRET: z.string().optional(),
  JWT_EXP: z.string().optional(),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess((value) => Number(value), z.number()),
  DB_NAME: z.string().default('postgres'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string(),
  DB_SYNCHRONIZE: z.preprocess((value) => !!value, z.boolean().default(false)),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.preprocess((value) => Number(value), z.number()),
  REDIS_EXP: z.preprocess((value) => Number(value), z.number()),
  LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),
});

const parse = configSchema.safeParse(process.env);

if (!parse.success) {
  console.error('Invalid environment:', parse.error.format());
  throw new Error('Invalid environment');
}

export const config = parse.data;
