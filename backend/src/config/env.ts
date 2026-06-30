import 'dotenv/config';

// Ek helper — agar required var missing hai to TURANT crash, undefined leak nahi
function required(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing required env variable: ${key}. Check your .env file.`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key]?.trim() || fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: Number(optional('PORT', '3000')),

  neo4j: {
    uri: required('NEO4J_URI'),
    user: required('NEO4J_USER'),
    password: required('NEO4J_PASSWORD'),
  },

  postgres: {
    url: required('DATABASE_URL'),
  },

  redis: {
    url: optional('REDIS_URL', 'redis://localhost:6379'),
  },

  ai: {
    groqApiKey: required('GROQ_API_KEY'),
  },
} as const;