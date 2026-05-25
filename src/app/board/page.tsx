import BoardClient from './BoardClient';
import {getInquiries} from '@/lib/inquiries';

export const dynamic = 'force-dynamic';

export default async function BoardPage() {
    const inquiries = await getInquiries();

    const listItems = inquiries.map(({id, title, author, createdAt}) => ({
        id,
        title,
        author,
        createdAt,
    }));

    return <BoardClient initialInquiries={listItems}/>;
}
