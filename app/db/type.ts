const UserRole = {
    ADMIN: 'ADMIN',
    AUTHOR: 'AUTHOR',
    EDITOR: 'EDITOR',
    SUBSCRIBER: 'SUBSCRIBER',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

const UserStatus = {
    VIP: 'VIP',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BLOCKED: 'BLOCKED',
    SUSPENDED: 'SUSPENDED',
} as const

export type UserStatus = (typeof UserRole)[keyof typeof UserRole]

const PostStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED',
    TRASHED: 'TRASHED',
} as const

export type PostStatus = (typeof UserRole)[keyof typeof UserRole]
