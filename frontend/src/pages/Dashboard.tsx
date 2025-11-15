import { useState, useEffect, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import type { Contact, MessageTemplate, ScheduledMessage } from "@/types";
import { Plus, Sparkles } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToast } from "../hooks/use-toast";
import { ContactCard } from "../components/ContactCard";
import { UpcomingEvent } from "../components/UpcomingEvent";
import { GreetingCard } from "../components/GreetingCard";
import { ContactDialog } from "../components/ContactDialog";
import { TemplateDialog } from "../components/TemplateDialog";
import { Button } from "../components/ui/button";

interface GetContactsData {
    contacts: Contact[];
}

interface GetTemplatesData {
    messageTemplates: MessageTemplate[];
}

// 🧠 GraphQL queries
const GET_CONTACTS = gql`
  query {
    contacts {
      id
      name
      phoneNumber
      birthday
      anniversary
    }
  }
`;

const GET_TEMPLATES = gql`
  query {
    messageTemplates {
      id
      type
      content
      design
    }
  }
`;

// 🧠 Mutations
const ADD_CONTACT = gql`
  mutation AddContact(
    $name: String!
    $phoneNumber: String!
    $birthday: String
    $anniversary: String
  ) {
    addContact(
      name: $name
      phoneNumber: $phoneNumber
      birthday: $birthday
      anniversary: $anniversary
    ) {
      id
      name
      phoneNumber
      birthday
      anniversary
    }
  }
`;

const UPDATE_CONTACT = gql`
  mutation UpdateContact(
    $id: ID!
    $name: String!
    $phoneNumber: String!
    $birthday: String
    $anniversary: String
  ) {
    updateContact(
      id: $id
      name: $name
      phoneNumber: $phoneNumber
      birthday: $birthday
      anniversary: $anniversary
    ) {
      id
    }
  }
`;

const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;

const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($id: ID!, $content: String!, $design: String!) {
    updateMessageTemplate(id: $id, content: $content, design: $design) {
      id
      content
      design
    }
  }
`;

/**
 * Build scheduled messages for ALL contacts.
 * This is pure/derived: no side effects, just takes contacts and returns
 * the next birthday/anniversary occurrences.
 */
function buildScheduledMessages(contacts: Contact[]): ScheduledMessage[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDate = (value?: string | null) => {
        if (!value) return null;

        let d: Date;

        // If it's all digits, treat as a millisecond timestamp
        if (/^\d+$/.test(value)) {
            d = new Date(Number(value));
        } else {
            d = new Date(value);
        }

        if (Number.isNaN(d.getTime())) return null;
        return d;
    };

    const updated: ScheduledMessage[] = [];

    contacts.forEach((c) => {
        // Birthday
        const birthdayDate = parseDate(c.birthday);
        if (birthdayDate) {
            const next = new Date(
                today.getFullYear(),
                birthdayDate.getMonth(),
                birthdayDate.getDate()
            );
            if (next < today) {
                next.setFullYear(today.getFullYear() + 1);
            }

            updated.push({
                id: `${c.id}-birthday`,
                contactId: c.id,
                contactName: c.name,
                scheduledDate: next.toISOString(),
                type: "birthday",
                status: "scheduled",
                templateId: "birthday",
            });
        }

        // Anniversary
        const anniversaryDate = parseDate(c.anniversary);
        if (anniversaryDate) {
            const next = new Date(
                today.getFullYear(),
                anniversaryDate.getMonth(),
                anniversaryDate.getDate()
            );
            if (next < today) {
                next.setFullYear(today.getFullYear() + 1);
            }

            updated.push({
                id: `${c.id}-anniversary`,
                contactId: c.id,
                contactName: c.name,
                scheduledDate: next.toISOString(),
                type: "anniversary",
                status: "scheduled",
                templateId: "anniversary",
            });
        }
    });

    return updated;
}

const Dashboard = () => {
    const { toast } = useToast();

    // 🔹 Local offline caches
    const [contacts, setContacts] = useLocalStorage<Contact[]>(
        "celebration-contacts",
        []
    );
    const [templates, setTemplates] = useLocalStorage<MessageTemplate[]>(
        "celebration-templates",
        []
    );

    // 🔹 Dialogs
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>();
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<
        MessageTemplate | undefined
    >();

    // 🧠 Apollo queries
    const { data: contactData, refetch: refetchContacts } =
        useQuery<GetContactsData>(GET_CONTACTS);
    const { data: templateData, refetch: refetchTemplates } =
        useQuery<GetTemplatesData>(GET_TEMPLATES);

    // 🧠 Mutations
    const [addContact] = useMutation(ADD_CONTACT);
    const [updateContact] = useMutation(UPDATE_CONTACT);
    const [deleteContact] = useMutation(DELETE_CONTACT);
    const [updateTemplate] = useMutation(UPDATE_TEMPLATE);

    // 🔹 Load data from server → into localStorage-backed state
    useEffect(() => {
        if (contactData?.contacts) {
            setContacts(contactData.contacts);
        }

        if (templateData?.messageTemplates) {
            setTemplates(templateData.messageTemplates);
        }
    }, [contactData, templateData, setContacts, setTemplates]);

    // 🔹 Derived: build scheduled messages from current contacts
    const scheduledMessages: ScheduledMessage[] = useMemo(
        () => buildScheduledMessages(contacts),
        [contacts]
    );

    const upcomingEvents = useMemo(
        () =>
            scheduledMessages
                .filter((m) => m.status === "scheduled")
                .sort(
                    (a, b) =>
                        new Date(a.scheduledDate).getTime() -
                        new Date(b.scheduledDate).getTime()
                )
                .slice(0, 10),
        [scheduledMessages]
    );

    // 🔹 Contact handlers
    const handleSaveContact = async (
        contactData: Omit<Contact, "id"> & { id?: string }
    ) => {
        try {
            const variables = {
                ...contactData,
                birthday: contactData.birthday
                    ? new Date(contactData.birthday).toISOString()
                    : null,
                anniversary: contactData.anniversary
                    ? new Date(contactData.anniversary).toISOString()
                    : null,
            };

            if (contactData.id) {
                await updateContact({ variables });
                toast({ title: "Contact updated successfully!" });
            } else {
                await addContact({ variables });
                toast({ title: "Contact added successfully!" });
            }

            await refetchContacts();
            setDialogOpen(false);
        } catch {
            toast({ title: "Failed to save contact", variant: "destructive" });
        }
    };

    const handleDeleteContact = async (id: string) => {
        try {
            await deleteContact({ variables: { id } });
            await refetchContacts();
            toast({ title: "Contact deleted" });
        } catch {
            toast({ title: "Failed to delete contact", variant: "destructive" });
        }
    };

    const handleEditContact = (contact: Contact) => {
        setEditingContact(contact);
        setDialogOpen(true);
    };

    // 🔹 Template handlers
    const handleSaveTemplate = async (
        templateData: Omit<MessageTemplate, "id"> & { id?: string }
    ) => {
        try {
            if (templateData.id) {
                await updateTemplate({
                    variables: {
                        id: templateData.id,
                        content: templateData.content,
                        design: templateData.design,
                    },
                });
                toast({ title: "Template updated successfully!" });
                await refetchTemplates();
            }
            setTemplateDialogOpen(false);
            setEditingTemplate(undefined);
        } catch {
            toast({ title: "Error updating template", variant: "destructive" });
        }
    };

    const handleEditTemplate = (template: MessageTemplate) => {
        setEditingTemplate(template);
        setTemplateDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-celebration opacity-10" />
                <div className="w-full px-4 sm:px-6 py-6 sm:py-8 relative">
                    <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-bold flex items-center gap-2 flex-wrap">
                                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
                                    Celebration Reminder
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Never miss a special moment
                                </p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingContact(undefined);
                                    setDialogOpen(true);
                                }}
                                size="default"
                                className="bg-primary hover:bg-primary/90 shadow-glow flex-shrink-0"
                            >
                                <Plus className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Add Contact</span>
                            </Button>
                        </div>
                    </div>

                    {/* Upcoming */}
                    {upcomingEvents.length > 0 && (
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                                Upcoming Celebrations
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {upcomingEvents.map((event) => (
                                    <UpcomingEvent key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contacts */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                            My Contacts ({contacts.length})
                        </h2>
                        {contacts.length === 0 ? (
                            <div className="glass-card p-8 sm:p-12 text-center">
                                <p className="text-muted-foreground mb-4">
                                    No contacts yet. Add your first contact to get started!
                                </p>
                                <Button
                                    onClick={() => {
                                        setEditingContact(undefined);
                                        setDialogOpen(true);
                                    }}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                    Add Your First Contact
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {contacts.map((contact) => (
                                    <ContactCard
                                        key={contact.id}
                                        contact={contact}
                                        onEdit={handleEditContact}
                                        onDelete={handleDeleteContact}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Templates */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                                Greeting Templates
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Click to edit
                            </p>
                        </div>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {templates.map((template) => (
                                <GreetingCard
                                    key={template.id}
                                    template={template}
                                    onClick={() => handleEditTemplate(template)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <ContactDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSaveContact}
                contact={editingContact}
            />
            <TemplateDialog
                open={templateDialogOpen}
                onOpenChange={setTemplateDialogOpen}
                onSave={handleSaveTemplate}
                template={editingTemplate}
            />
        </div>
    );
};

export default Dashboard;
