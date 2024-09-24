import { WorkerEntrypoint } from 'cloudflare:workers';
import { prismaCreateUser, prismaGetUsers } from './db/user.server';
import { UserRole, UserStatus } from './db/type';

export class UserService extends WorkerEntrypoint<Env> {
	async getUsers() {
		const db = this.env.DB;
		const users = await prismaGetUsers(db);
		return users;
	}

	async createUser(email: string, role: UserRole, status: UserStatus) {
		const db = this.env.DB;
		const user = await prismaCreateUser(db, {
			email,
			role,
			status,
		});
		return user;
	}
}
