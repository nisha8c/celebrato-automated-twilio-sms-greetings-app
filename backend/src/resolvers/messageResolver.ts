import { prisma } from "../prisma";
import { sendSMS } from "../sms";

export const messageResolver = {
    Query: {
        messageTemplates: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error("Unauthorized");
            return prisma.messageTemplate.findMany();
        },
    },

    Mutation: {
        addMessageTemplate: async (
            _: any,
            { type, content }: { type: string; content: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");
            return prisma.messageTemplate.create({
                data: { type, content },
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

            // Pick a random template of the requested type
            const templates = await prisma.messageTemplate.findMany({ where: { type } });
            if (templates.length === 0) throw new Error(`No templates for ${type}`);

            const chosen = templates[Math.floor(Math.random() * templates.length)];
            await sendSMS(phoneNumber, chosen.content);
            return true;
        },
    },
};
