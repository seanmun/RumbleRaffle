import { z } from 'zod'

// Define the schema for environment variables
const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),

  // Optional
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_PATH: z.string().optional(),
})

// Validate environment variables at build time
function validateEnv() {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
      throw new Error(`Invalid environment variables:\n${missingVars}`)
    }
    throw error
  }
}

// Export validated env (this will throw at build time if validation fails)
export const env = validateEnv()

// Type-safe environment variable access
export type Env = z.infer<typeof envSchema>
