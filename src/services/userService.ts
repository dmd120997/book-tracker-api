import prisma from "../prisma";
import bcrypt from "bcrypt";
import { Prisma, User } from "@prisma/client";
import { toUserDTO } from "../dto/user.dto";

export const UserService = {
  getById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },

  getPublicUser: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return toUserDTO(user);
  },

  createUser: async (data: Prisma.UserCreateInput): Promise<User> => {
    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashed,
      },
    });
  },

  verifyCredentials: async (
    email: string,
    password: string
  ): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  },
  register: async (data: { email: string; password: string }) => {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new Error("Email already in use");

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
      },
    });

    return toUserDTO(user);
  },

  login: async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return null;

    const valid = await bcrypt.compare(data.password, user.password);
    return valid ? toUserDTO(user) : null;
  },
};
