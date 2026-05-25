import {Suspense} from 'react';
import BoardClient from './BoardClient';
import {getInquiries} from '@/lib/inquiries';
import {toListItem} from '@/types/inquiry';

export const dynamic = 'force-dynamic';

export default async function BoardPage() {
    const inquiries = await getInquiries();

    return (
        <Suspense fallback={null}>
            <BoardClient initialInquiries={inquiries.map(toListItem)}/>
        </Suspense>
    );
}
