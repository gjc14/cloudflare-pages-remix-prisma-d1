import { PrismaClient, User } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { UserRole, UserStatus } from './type'

const createPrismaClient = (d1: D1Database) => {
	const adapter = new PrismaD1(d1)
	return new PrismaClient({ adapter })
}

export const prismaCreateUser = async (
	d1: D1Database,
	props: {
		email: string
		role: UserRole
		status: UserStatus
	}
): Promise<{ user: User }> => {
	const { email, role, status } = props
	const prisma = createPrismaClient(d1)

	const user = await prisma.user.create({
		data: {
			email,
			role,
			status,
		},
	})
	return { user }
}

export const prismaGetUsers = async (db: D1Database): Promise<{ users: User[] }> => {
	const prisma = createPrismaClient(db)

	const users = await prisma.user.findMany()
	return { users }
}
