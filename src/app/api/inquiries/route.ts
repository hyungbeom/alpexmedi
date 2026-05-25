import {NextResponse} from 'next/server';
import {createInquiry, getInquiries, InquiryStorageError} from '@/lib/inquiries';
import type {CreateInquiryInput} from '@/types/inquiry';

function validateBody(body: unknown): CreateInquiryInput | null {
    if (!body || typeof body !== 'object') {
        return null;
    }

    const {title, author, email, phone, content} = body as Record<string, unknown>;

    if (
        typeof title !== 'string' ||
        typeof author !== 'string' ||
        typeof email !== 'string' ||
        typeof content !== 'string'
    ) {
        return null;
    }

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedEmail = email.trim();
    const trimmedContent = content.trim();
    const trimmedPhone =
        typeof phone === 'string' && phone.trim() ? phone.trim() : undefined;

    if (
        !trimmedTitle ||
        !trimmedAuthor ||
        !trimmedEmail ||
        !trimmedContent ||
        trimmedTitle.length > 120 ||
        trimmedAuthor.length > 40 ||
        trimmedEmail.length > 120 ||
        trimmedContent.length > 5000
    ) {
        return null;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
        return null;
    }

    return {
        title: trimmedTitle,
        author: trimmedAuthor,
        email: trimmedEmail,
        phone: trimmedPhone,
        content: trimmedContent,
    };
}

export async function GET() {
    const inquiries = await getInquiries();

    return NextResponse.json({
        inquiries: inquiries.map(({id, title, author, createdAt}) => ({
            id,
            title,
            author,
            createdAt,
        })),
    });
}

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            {error: '잘못된 요청입니다.'},
            {status: 400},
        );
    }

    const input = validateBody(body);

    if (!input) {
        return NextResponse.json(
            {error: '입력값을 확인해 주세요.'},
            {status: 400},
        );
    }

    let inquiry;

    try {
        inquiry = await createInquiry(input);
    } catch (error) {
        if (error instanceof InquiryStorageError) {
            return NextResponse.json({error: error.message}, {status: 503});
        }

        throw error;
    }

    return NextResponse.json(
        {
            inquiry: {
                id: inquiry.id,
                title: inquiry.title,
                author: inquiry.author,
                createdAt: inquiry.createdAt,
            },
        },
        {status: 201},
    );
}
