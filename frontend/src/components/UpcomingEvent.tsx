
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Gift, Sparkles } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type {ScheduledMessage} from "../types";

interface UpcomingEventProps {
    event: ScheduledMessage;
}

/**
 * Displays an upcoming birthday or anniversary event.
 * Color-coded and animated depending on the event type and proximity.
 */
export function UpcomingEvent({ event }: UpcomingEventProps) {
    const daysUntil = differenceInDays(new Date(event.scheduledDate), new Date());
    const isToday = daysUntil === 0;
    const isPast = daysUntil < 0;
    const isThisWeek = daysUntil <= 7 && daysUntil >= 0;

    // Rotating gradients for dynamic card backgrounds
    const eventGradients = [
        "from-celebration-purple/20 to-celebration-pink/20",
        "from-celebration-blue/20 to-celebration-purple/20",
        "from-celebration-pink/20 to-celebration-orange/20",
        "from-celebration-gold/20 to-celebration-orange/20",
    ];

    const gradientIndex = event.contactName.length % eventGradients.length;
    const gradient = eventGradients[gradientIndex];

    return (
        <Card
            className={`glass-card shadow-card p-4 w-full hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-to-br ${gradient} ${
                isToday ? "ring-2 ring-celebration-gold" : ""
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Left Section */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                            event.type === "birthday"
                                ? "bg-gradient-to-br from-celebration-pink to-celebration-purple"
                                : "bg-gradient-to-br from-celebration-purple to-celebration-blue"
                        } ${isToday ? "animate-pulse" : ""}`}
                    >
                        {event.type === "birthday" ? (
                            <Calendar className="h-5 w-5 text-white stroke-[2.5] drop-shadow-md" />
                        ) : (
                            <Gift className="h-5 w-5 text-white stroke-[2.5] drop-shadow-md" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-base text-foreground truncate">
                                {event.contactName}
                            </h4>
                            {isThisWeek && !isPast && (
                                <Sparkles className="h-4 w-4 text-celebration-gold animate-pulse flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize mb-1">
                            {event.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(event.scheduledDate), "EEEE, MMM dd, yyyy")}
                        </p>
                    </div>
                </div>

                {/* Right Section - Status Badge */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge
                        variant={event.status === "sent" ? "secondary" : "default"}
                        className={`text-xs font-semibold transition-all duration-300 ${
                            event.status === "scheduled"
                                ? isToday
                                    ? "bg-celebration-gold text-foreground animate-pulse shadow-glow"
                                    : isThisWeek
                                        ? "bg-celebration-orange text-white"
                                        : "bg-primary text-primary-foreground"
                                : isPast
                                    ? "bg-muted text-muted-foreground"
                                    : ""
                        }`}
                    >
                        {event.status === "sent"
                            ? "Sent"
                            : isPast
                                ? "Missed"
                                : isToday
                                    ? "🎉 Today!"
                                    : `${daysUntil}d`}
                    </Badge>
                </div>
            </div>
        </Card>
    );
}
