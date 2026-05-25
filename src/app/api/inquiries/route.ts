import {NextResponse} from 'next/server';
import {createInquiry, getInquiries, InquiryStorageError} from '@/lib/inquiries';
import {toListItem} from '@/types/inquiry';
import type {CreateInquiryInput} from '@/types/inquiry';

function validateBody(body: unknown): CreateInquiryInput | null {
    if (!body || typeof body !== 'object') {
        return null;
    }

    const record = body as Record<string, unknown>;
    const {title, author, email, phone, content, isSecret, password} = record;

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
    const secret = isSecret === true;
    const trimmedPassword =
        typeof password === 'string' ? password.trim() : '';

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

    if (secret && (trimmedPassword.length < 4 || trimmedPassword.length > 32)) {
        return null;
    }

    return {
        title: trimmedTitle,
        author: trimmedAuthor,
        email: trimmedEmail,
        phone: trimmedPhone,
        content: trimmedContent,
        isSecret: secret,
        password: secret ? trimmedPassword : undefined,
    };
}

export async function GET() {
    const inquiries = await getInquiries();

    return NextResponse.json({
        inquiries: inquiries.map(toListItem),
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
            {error: '입력값을 확인해 주세요. 비밀글은 비밀번호 4~32자가 필요합니다.'},
            {status: 400},
        );
    }

    try {
        const inquiry = await createInquiry(input);

        return NextResponse.json(
            {inquiry: toListItem(inquiry)},
            {status: 201},
        );
    } catch (error) {
        if (error instanceof InquiryStorageError) {
            return NextResponse.json({error: error.message}, {status: 503});
        }

        if (error instanceof Error && error.message === 'INVALID_SECRET_PASSWORD') {
            return NextResponse.json(
                {error: '비밀글 비밀번호는 4~32자로 입력해 주세요.'},
                {status: 400},
            );
        }

        throw error;
    }
}
