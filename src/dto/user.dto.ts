import { User } from '@prisma/client';

export type UserDTO = Omit<User, 'password'>;

export function toUserDTO(user: User): UserDTO {
    const { password, ...publicData } = user;
    return publicData;
}