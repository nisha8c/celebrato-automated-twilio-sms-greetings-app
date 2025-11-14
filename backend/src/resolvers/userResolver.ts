import bcrypt from "bcrypt";
import { generateToken } from "../auth";
import { prisma } from "../prisma";

export const userResolver = {
    Query: {
        me: async (_: any, __: any, { user }: any) => {
            // Not logged in
            if (!user) return null;

            // Load full user from DB so name/email/etc are present
            return prisma.user.findUnique({
                where: { id: user.id },
            });
        },
    },
    Mutation: {
        register: async (_: any, { name, email, password, phoneNumber }: any) => {
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { name, email, passwordHash, phoneNumber },
            });
            return generateToken(user.id);
        },
        login: async (_: any, { email, password }: any) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.passwordHash)))
                throw new Error("Invalid credentials");
            return generateToken(user.id);
        },
    },
};
