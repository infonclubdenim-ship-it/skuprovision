import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
    const adapter = new PrismaPg(process.env.DATABASE_URL as string)
    return new PrismaClient({ adapter })
}

// In Next.js (especially during development with Turbopack/Webpack hot reloading),
// it's essential to cache the Prisma Client instance to avoid exhausting database connections.
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
