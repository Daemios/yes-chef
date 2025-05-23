/**
 * Prisma Service
 * Singleton instance of the Prisma client
 */
import { PrismaClient } from '@prisma/client'

// Define a global variable to store the prisma instance
declare global {
  var prisma: PrismaClient | undefined
}

// Export a singleton prisma client instance
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// In development, we want to use a global variable so that the connection
// is not lost on hot-reloads
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

