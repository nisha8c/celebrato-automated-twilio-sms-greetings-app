export interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    birthday?: string;
    anniversary?: string;
}

export interface MessageTemplate {
    id: string;
    type: "birthday" | "anniversary";
    design: "confetti" | "balloons" | "hearts" | "cake" | "fireworks";
    content: string;
}

export interface ScheduledMessage {
    id: string;
    contactId: string;
    contactName: string;
    scheduledDate: string;
    type: "birthday" | "anniversary";
    status: "scheduled" | "sent";
    templateId: string;
}
