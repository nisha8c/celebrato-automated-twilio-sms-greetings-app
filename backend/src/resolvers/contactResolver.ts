import { prisma } from "../prisma";

export const contactResolver = {
    Query: {
        contacts: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");

            return prisma.contact.findMany({
                where: { userId: user.id },
                orderBy: { id: "asc" },
            });
        },
    },

    Mutation: {
        addContact: async (_: any, args: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");

            return prisma.contact.create({
                data: {
                    name: args.name,
                    phoneNumber: args.phoneNumber,
                    birthday: args.birthday ? new Date(args.birthday) : null,
                    anniversary: args.anniversary ? new Date(args.anniversary) : null,
                    userId: user.id,
                },
            });
        },

        updateContact: async (_: any, args: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");

            return prisma.contact.update({
                where: { id: Number(args.id) },
                data: {
                    name: args.name,
                    phoneNumber: args.phoneNumber,
                    birthday: args.birthday ? new Date(args.birthday) : null,
                    anniversary: args.anniversary ? new Date(args.anniversary) : null,
                },
            });
        },

        deleteContact: async (_: any, { id }: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");

            await prisma.contact.delete({
                where: { id: Number(id) },
            });

            return true;
        },
    },
};
