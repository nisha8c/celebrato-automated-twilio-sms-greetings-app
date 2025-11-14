import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Contact } from "../types";
import { Button } from "./ui/button";

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (contact: Omit<Contact, "id"> & { id?: string }) => void;
    contact?: Contact;
}

// Helper: convert whatever we have into "YYYY-MM-DD" for <input type="date">
function toInputDate(value: unknown): string {
    if (!value) return "";

    // If it's a number or a numeric string like "1763164800000"
    if (typeof value === "number" || /^\d+$/.test(String(value))) {
        const ts = typeof value === "number" ? value : Number(value);
        const d = new Date(ts);
        if (Number.isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10);
    }

    if (typeof value === "string") {
        // Already yyyy-MM-dd?
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10);
    }

    return "";
}

export function ContactDialog({
                                  open,
                                  onOpenChange,
                                  onSave,
                                  contact,
                              }: ContactDialogProps) {
    const [formData, setFormData] = useState<Omit<Contact, "id">>({
        name: "",
        phoneNumber: "",
        birthday: "",
        anniversary: "",
    });

    // Populate form on open / contact change
    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name,
                phoneNumber: contact.phoneNumber,
                birthday: toInputDate(contact.birthday),
                anniversary: toInputDate(contact.anniversary),
            });
        } else {
            setFormData({
                name: "",
                phoneNumber: "",
                birthday: "",
                anniversary: "",
            });
        }
    }, [contact, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            ...formData,
            id: contact?.id,
            birthday: formData.birthday || undefined,
            anniversary: formData.anniversary || undefined,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>
                        {contact ? "Edit Contact" : "Add New Contact"}
                    </DialogTitle>
                    <DialogDescription>
                        {contact
                            ? "Update your contact details and save the changes."
                            : "Fill in the details to add a new contact."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            placeholder="John Doe"
                            className="glass-card"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, phoneNumber: e.target.value })
                            }
                            required
                            placeholder="+1234567890"
                            className="glass-card"
                        />
                    </div>

                    {/* Birthday */}
                    <div>
                        <Label htmlFor="birthday">Birthday (Optional)</Label>
                        <Input
                            id="birthday"
                            type="date"
                            value={formData.birthday || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, birthday: e.target.value })
                            }
                            className="glass-card"
                        />
                    </div>

                    {/* Anniversary */}
                    <div>
                        <Label htmlFor="anniversary">Anniversary (Optional)</Label>
                        <Input
                            id="anniversary"
                            type="date"
                            value={formData.anniversary || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, anniversary: e.target.value })
                            }
                            className="glass-card"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                            {contact ? "Update Contact" : "Add Contact"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
