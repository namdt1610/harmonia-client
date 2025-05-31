import { User } from '@/types'

export type LoginResponse = {
    access: string
    user: User
}

export type LoginPayload = {
    username_or_email: string
    password: string
}

export type RegisterResponse = {
    user: User
}

export type RegisterPayload = {
    username: string
    email: string
    password: string
}
