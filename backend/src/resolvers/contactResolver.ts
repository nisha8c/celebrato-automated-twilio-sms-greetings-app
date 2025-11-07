import { prisma } from "../prisma";

export const contactResolver = {
    Query: {
        contacts: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");
            return prisma.contact.findMany({ where: { userId: user.id } });
        },
    },
    Mutation: {
        addContact: async (_: any, args: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");
            return prisma.contact.create({
                data: { ...args, userId: user.id },
            });
        },
    },
};
