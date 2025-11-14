import { prisma } from "../prisma";
import { sendSMS } from "../sms";

export const messageResolver = {
    Query: {
        messageTemplates: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");

            return prisma.messageTemplate.findMany({
                orderBy: { id: "asc" },
            });
        },
    },

    Mutation: {
        addMessageTemplate: async (
            _: any,
            { type, content, design }: { type: string; content: string; design: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");

            return prisma.messageTemplate.create({
                data: { type, content, design },
            });
        },

        updateMessageTemplate: async (
            _: any,
            { id, content, design }: { id: number; content: string; design: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");

            return prisma.messageTemplate.update({
                where: { id },
                data: { content, design },
            });
        },

        deleteMessageTemplate: async (_: any, { id }: { id: number }, { user }: any) => {
            if (!user) throw new Error("Unauthorized");

            await prisma.messageTemplate.delete({ where: { id } });
            return true;
        },

        sendTestMessage: async (
            _: any,
            { phoneNumber, type }: { phoneNumber: string; type: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");

            // load templates for the given type
            const templates = await prisma.messageTemplate.findMany({
                where: { type },
            });

            if (templates.length === 0) {
                throw new Error(`No templates found for type: ${type}`);
            }

            // Pick a random template
            const chosen = templates[Math.floor(Math.random() * templates.length)];

            await sendSMS(phoneNumber, chosen.content);
            return true;
        },
    },
};
