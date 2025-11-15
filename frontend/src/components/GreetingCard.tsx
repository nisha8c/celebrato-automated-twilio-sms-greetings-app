
import { Card } from "./ui/card";
import {
    Cake,
    Heart,
    Sparkles,
    PartyPopper,
    Stars,
    HelpCircle,
} from "lucide-react";
import type {MessageTemplate} from "../types";
import React from "react";

interface GreetingCardProps {
    template: MessageTemplate;
    selected?: boolean;
    onClick?: () => void;
}

const designIcons: Record<string, React.ElementType> = {
    confetti: PartyPopper,
    balloons: Sparkles,
    hearts: Heart,
    cake: Cake,
    fireworks: Stars,
};

const designColors: Record<string, string> = {
    confetti: "bg-celebration-purple/20 text-celebration-purple",
    balloons: "bg-celebration-blue/20 text-celebration-blue",
    hearts: "bg-celebration-pink/20 text-celebration-pink",
    cake: "bg-celebration-gold/20 text-celebration-gold",
    fireworks: "bg-celebration-orange/20 text-celebration-orange",
};

export function GreetingCard({
                                 template,
                                 selected,
                                 onClick,
                             }: GreetingCardProps) {
    const Icon = designIcons[template.design] || HelpCircle;
    const colorClass = designColors[template.design] || "bg-gray-200 text-gray-700";

    return (
        <Card
            className={`glass-card shadow-card p-3 sm:p-4 w-[240px] sm:w-[260px] flex-shrink-0 cursor-pointer transition-all duration-300 hover:shadow-glow ${
                selected ? "ring-2 ring-primary" : ""
            }`}
            onClick={onClick}
        >
            <div className="flex flex-col gap-2 sm:gap-3 h-full">
                {/* Icon */}
                <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${colorClass}`}
                >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                {/* Template Info */}
                <div className="flex-1">
                    <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 capitalize text-foreground">
                        {template.type} — {template.design}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 break-words">
                        {template.content}
                    </p>
                </div>
            </div>
        </Card>
    );
}
