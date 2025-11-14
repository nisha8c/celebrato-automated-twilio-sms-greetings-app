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
            { id, content, design }: { id: string; content: string; design: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");

            const templateId = Number(id);
            if (Number.isNaN(templateId)) {
                throw new Error("Invalid template id");
            }

            return prisma.messageTemplate.update({
                where: { id: templateId },
                data: { content, design },
            });
        },

        deleteMessageTemplate: async (
            _: any,
            { id }: { id: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");

            const templateId = Number(id);
            if (Number.isNaN(templateId)) {
                throw new Error("Invalid template id");
            }

            await prisma.messageTemplate.delete({ where: { id: templateId } });
            return true;
        },

        sendTestMessage: async (
            _: any,
            { phoneNumber, type }: { phoneNumber: string; type: string },
            { user }: any
        ) => {
            if (!user) throw new Error("Unauthorized");

            const templates = await prisma.messageTemplate.findMany({
                where: { type },
            });

            if (templates.length === 0) {
                throw new Error(`No templates found for type: ${type}`);
            }

            const chosen = templates[Math.floor(Math.random() * templates.length)];

            await sendSMS(phoneNumber, chosen.content);
            return true;
        },
    },
};
