import {NextResponse} from 'next/server';
import {unlockInquiry} from '@/lib/inquiries';
import {toPublicInquiry} from '@/types/inquiry';

type RouteContext = {
    params: Promise<{id: string}>;
};

export async function POST(request: Request, context: RouteContext) {
    const {id} = await context.params;

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            {error: '잘못된 요청입니다.'},
            {status: 400},
        );
    }

    const password =
        body &&
        typeof body === 'object' &&
        typeof (body as Record<string, unknown>).password === 'string'
            ? (body as Record<string, string>).password.trim()
            : '';

    if (!password) {
        return NextResponse.json(
            {error: '비밀번호를 입력해 주세요.'},
            {status: 400},
        );
    }

    const inquiry = await unlockInquiry(id, password);

    if (!inquiry) {
        return NextResponse.json(
            {error: '비밀번호가 일치하지 않습니다.'},
            {status: 401},
        );
    }

    return NextResponse.json({inquiry: toPublicInquiry(inquiry)});
}
