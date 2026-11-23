import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { loadEnvironment } from '../config/env.js'

const { DATABASE_URL } = loadEnvironment()
const adapter = new PrismaPg({ connectionString: DATABASE_URL })

export const prisma = new PrismaClient({ adapter })
