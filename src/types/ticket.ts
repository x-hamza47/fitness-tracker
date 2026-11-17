export type TicketType = "contact" | "issue" | "feedback";
export type TicketStatus = "open" | "in_progress" | "resolved";

export type TicketItem = {
    id: string;
    type: TicketType;
    subject: string;
    message: string;
    status: TicketStatus;
    adminReply?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
        username: string;
        profilePicture?: string | null;
    };
};

export type CreateTicketPayload = {
    type: TicketType;
    subject: string;
    message: string;
};
