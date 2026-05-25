import {promises as fs} from 'fs';
import path from 'path';
import {randomUUID} from 'crypto';
import type {CreateInquiryInput, Inquiry} from '@/types/inquiry';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');

async function ensureDataFile() {
    await fs.mkdir(DATA_DIR, {recursive: true});

    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
}

export async function getInquiries(): Promise<Inquiry[]> {
    await ensureDataFile();

    try {
        const raw = await fs.readFile(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as Inquiry[];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    } catch {
        return [];
    }
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
    const inquiries = await getInquiries();
    return inquiries.find((item) => item.id === id) ?? null;
}

export async function createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
    await ensureDataFile();

    const inquiries = await getInquiries();
    const inquiry: Inquiry = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...input,
    };

    inquiries.unshift(inquiry);
    await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');

    return inquiry;
}
