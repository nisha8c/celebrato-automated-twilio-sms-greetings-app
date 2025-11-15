import { Card } from "./ui/card";
import { Button } from "./ui/button.tsx";
import { Calendar, Gift, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import type { Contact } from "../types";

interface ContactCardProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

// Safely parse & format any date-like value
const formatDate = (date?: string | null) => {
    if (!date) return null;
    try {
        const parsed =
            /^\d+$/.test(date) ? new Date(Number(date)) : new Date(date);

        if (Number.isNaN(parsed.getTime())) return "Invalid date";

        return format(parsed, "MMM dd, yyyy");
    } catch {
        return "Invalid date";
    }
};


export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
    const birthdayText = formatDate(contact.birthday);
    const anniversaryText = formatDate(contact.anniversary);

    return (
        <Card className="glass-card shadow-card p-4 w-full hover:shadow-glow transition-all duration-300">
            <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
                            {contact.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {contact.phoneNumber}
                        </p>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => onEdit(contact)}
                        >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                            onClick={() => onDelete(contact.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                    </div>
                </div>

                {/* Dates */}
                <div className="flex flex-col gap-2">
                    {birthdayText && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-celebration-pink/20 flex-shrink-0">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-celebration-pink" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Birthday</p>
                                <p className="font-medium text-foreground text-xs sm:text-sm">
                                    {birthdayText}
                                </p>
                            </div>
                        </div>
                    )}

                    {anniversaryText && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-celebration-purple/20 flex-shrink-0">
                                <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-celebration-purple" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Anniversary</p>
                                <p className="font-medium text-foreground text-xs sm:text-sm">
                                    {anniversaryText}
                                </p>
                            </div>
                        </div>
                    )}

                    {!birthdayText && !anniversaryText && (
                        <p className="text-xs text-muted-foreground italic">
                            No dates added yet
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
