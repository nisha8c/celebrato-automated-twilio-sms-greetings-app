import twilio from "twilio";
const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export const sendSMS = async (to: string, message: string) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to,
        });
        console.log(`✅ Sent SMS to ${to}`);
    } catch (err) {
        console.error(`❌ Failed to send SMS:`, err);
    }
};
