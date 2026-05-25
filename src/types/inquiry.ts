export type Inquiry = {
    id: string;
    title: string;
    author: string;
    email: string;
    phone?: string;
    content: string;
    createdAt: string;
};

export type CreateInquiryInput = {
    title: string;
    author: string;
    email: string;
    phone?: string;
    content: string;
};
