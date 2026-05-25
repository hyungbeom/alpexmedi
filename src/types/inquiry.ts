export type Inquiry = {
    id: string;
    title: string;
    author: string;
    email: string;
    phone?: string;
    content: string;
    createdAt: string;
    isSecret?: boolean;
    passwordHash?: string;
};

export type CreateInquiryInput = {
    title: string;
    author: string;
    email: string;
    phone?: string;
    content: string;
    isSecret?: boolean;
    password?: string;
};

export type InquiryListItem = {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    isSecret: boolean;
};

export type PublicInquiry = Omit<Inquiry, 'passwordHash'>;

export function toPublicInquiry(inquiry: Inquiry): PublicInquiry {
    const {passwordHash: _passwordHash, ...publicInquiry} = inquiry;
    return publicInquiry;
}

export function toListItem(inquiry: Inquiry): InquiryListItem {
    return {
        id: inquiry.id,
        title: inquiry.title,
        author: inquiry.isSecret ? '비밀글' : inquiry.author,
        createdAt: inquiry.createdAt,
        isSecret: Boolean(inquiry.isSecret),
    };
}
