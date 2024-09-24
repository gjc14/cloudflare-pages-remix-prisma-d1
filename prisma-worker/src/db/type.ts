const UserRole = {
	ADMIN: 'ADMIN',
	AUTHOR: 'AUTHOR',
	EDITOR: 'EDITOR',
	SUBSCRIBER: 'SUBSCRIBER',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export function isUserRole(role: any): role is UserRole {
	return ['ADMIN', 'AUTHOR', 'EDITOR', 'SUBSCRIBER'].includes(role)
}

const UserStatus = {
	VIP: 'VIP',
	ACTIVE: 'ACTIVE',
	INACTIVE: 'INACTIVE',
	BLOCKED: 'BLOCKED',
	SUSPENDED: 'SUSPENDED',
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export function isUserStatus(status: any): status is UserStatus {
	return ['VIP', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED'].includes(status)
}

const PostStatus = {
	DRAFT: 'DRAFT',
	PUBLISHED: 'PUBLISHED',
	ARCHIVED: 'ARCHIVED',
	TRASHED: 'TRASHED',
} as const

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus]

export function isPostStatus(status: any): status is PostStatus {
	return ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'TRASHED'].includes(status)
}
