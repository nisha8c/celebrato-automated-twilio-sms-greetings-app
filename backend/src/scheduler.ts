import cron from "node-cron";
import { prisma } from "./prisma";
import { sendSMS } from "./sms";

export const startScheduler = () => {
    cron.schedule("0 8 * * *", async () => {
        console.log("🎉 Running daily greeting scheduler...");
        const today = new Date();
        const contacts = await prisma.contact.findMany();

        for (const c of contacts) {
            const dateStr = `${today.getMonth() + 1}-${today.getDate()}`;
            const birthdayStr = c.birthday ? `${c.birthday.getMonth() + 1}-${c.birthday.getDate()}` : "";
            const anniversaryStr = c.anniversary ? `${c.anniversary.getMonth() + 1}-${c.anniversary.getDate()}` : "";

            if (dateStr === birthdayStr) {
                await sendSMS(c.phoneNumber, `🎂 Happy Birthday ${c.name}!`);
            } else if (dateStr === anniversaryStr) {
                await sendSMS(c.phoneNumber, `💍 Happy Anniversary ${c.name}!`);
            }
        }
    });
};
