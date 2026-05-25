import {NextResponse} from 'next/server';
import {getInquiryById} from '@/lib/inquiries';

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

    return NextResponse.json({inquiry});
}
