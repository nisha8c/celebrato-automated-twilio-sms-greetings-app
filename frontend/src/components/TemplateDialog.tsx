import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Cake,
    Heart,
    Sparkles,
    PartyPopper,
    Stars,
} from "lucide-react";
import type {MessageTemplate} from "../types";

interface TemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (template: Omit<MessageTemplate, "id"> & { id?: string }) => void;
    template?: MessageTemplate;
}

const designOptions = [
    { value: "confetti", label: "Confetti", icon: PartyPopper },
    { value: "balloons", label: "Balloons", icon: Sparkles },
    { value: "hearts", label: "Hearts", icon: Heart },
    { value: "cake", label: "Cake", icon: Cake },
    { value: "fireworks", label: "Fireworks", icon: Stars },
] as const;

export function TemplateDialog({
                                   open,
                                   onOpenChange,
                                   onSave,
                                   template,
                               }: TemplateDialogProps) {
    const [type, setType] = useState<"birthday" | "anniversary">("birthday");
    const [design, setDesign] = useState<MessageTemplate["design"]>("confetti");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (template) {
            setType(template.type);
            setDesign(template.design);
            setContent(template.content);
        } else {
            setType("birthday");
            setDesign("confetti");
            setContent("");
        }
    }, [template, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        onSave({
            ...(template?.id ? { id: template.id } : {}),
            type,
            design,
            content: content.trim(),
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {template ? "Edit Template" : "Create New Template"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Template Type (Fixed to two types) */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Template Type</Label>
                        <Select
                            value={type}
                            onValueChange={(value) =>
                                setType(value as "birthday" | "anniversary")
                            }
                        >
                            <SelectTrigger id="type" className="glass-card">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="birthday">🎂 Birthday</SelectItem>
                                <SelectItem value="anniversary">💖 Anniversary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Design Theme */}
                    <div className="space-y-2">
                        <Label htmlFor="design">Design Theme</Label>
                        <Select
                            value={design}
                            onValueChange={(value) =>
                                setDesign(value as MessageTemplate["design"])
                            }
                        >
                            <SelectTrigger id="design" className="glass-card">
                                <SelectValue placeholder="Select design" />
                            </SelectTrigger>
                            <SelectContent>
                                {designOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Message Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Message Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Write your greeting message..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            required
                            maxLength={500}
                            className="glass-card"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {content.length}/500 characters
                        </p>
                    </div>

                    {/* Footer Buttons */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!content.trim()}>
                            {template ? "Update Template" : "Create Template"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
