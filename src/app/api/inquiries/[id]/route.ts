import {NextResponse} from 'next/server';
import {getInquiryById} from '@/lib/inquiries';
import {toPublicInquiry} from '@/types/inquiry';

type RouteContext = {
    params: Promise<{id: string}>;
};

export async function GET(_request: Request, context: RouteContext) {
    const {id} = await context.params;
    const inquiry = await getInquiryById(id);

    if (!inquiry) {
        return NextResponse.json(
            {error: '문의를 찾을 수 없습니다.'},
            {status: 404},
        );
    }

    if (inquiry.isSecret) {
        return NextResponse.json({
            requiresPassword: true,
            inquiry: {
                id: inquiry.id,
                title: inquiry.title,
                createdAt: inquiry.createdAt,
                isSecret: true,
            },
        });
    }

    return NextResponse.json({inquiry: toPublicInquiry(inquiry)});
}
