import {promises as fs} from 'fs';
import path from 'path';
import {randomUUID} from 'crypto';
import {head, put} from '@vercel/blob';
import {hashPassword, verifyPassword} from '@/lib/inquiry-password';
import type {CreateInquiryInput, Inquiry} from '@/types/inquiry';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');
const BLOB_PATHNAME = 'inquiries.json';

export class InquiryStorageError extends Error {
    constructor(message = '문의 저장소를 사용할 수 없습니다.') {
        super(message);
        this.name = 'InquiryStorageError';
    }
}

function sortInquiries(items: Inquiry[]): Inquiry[] {
    return [...items].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

function parseInquiries(raw: unknown): Inquiry[] {
    if (!Array.isArray(raw)) {
        return [];
    }
    return sortInquiries(raw as Inquiry[]);
}

function useBlobStorage(): boolean {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function useLocalFileStorage(): boolean {
    return !process.env.VERCEL;
}

async function ensureLocalDataFile() {
    await fs.mkdir(DATA_DIR, {recursive: true});

    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
}

async function readFromBlob(): Promise<Inquiry[]> {
    try {
        const blob = await head(BLOB_PATHNAME);
        const response = await fetch(blob.url);

        if (!response.ok) {
            return [];
        }

        return parseInquiries(await response.json());
    } catch {
        return [];
    }
}

async function writeToBlob(inquiries: Inquiry[]): Promise<void> {
    await put(BLOB_PATHNAME, JSON.stringify(inquiries, null, 2), {
        access: 'public',
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: 'application/json',
    });
}

async function readFromLocalFile(): Promise<Inquiry[]> {
    await ensureLocalDataFile();

    try {
        const raw = await fs.readFile(DATA_FILE, 'utf-8');
        return parseInquiries(JSON.parse(raw));
    } catch {
        return [];
    }
}

async function writeToLocalFile(inquiries: Inquiry[]): Promise<void> {
    await ensureLocalDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
}

async function readInquiries(): Promise<Inquiry[]> {
    if (useBlobStorage()) {
        return readFromBlob();
    }

    if (useLocalFileStorage()) {
        return readFromLocalFile();
    }

    return [];
}

async function writeInquiries(inquiries: Inquiry[]): Promise<void> {
    if (useBlobStorage()) {
        await writeToBlob(inquiries);
        return;
    }

    if (useLocalFileStorage()) {
        await writeToLocalFile(inquiries);
        return;
    }

    throw new InquiryStorageError(
        'Vercel Blob 저장소가 연결되지 않았습니다. Vercel 대시보드에서 Blob 스토어를 생성해 주세요.',
    );
}

export async function getInquiries(): Promise<Inquiry[]> {
    return readInquiries();
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
    const inquiries = await getInquiries();
    return inquiries.find((item) => item.id === id) ?? null;
}

export async function createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
    const inquiries = await readInquiries();
    const {password, isSecret, ...rest} = input;

    const inquiry: Inquiry = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        isSecret: Boolean(isSecret),
        ...rest,
    };

    if (inquiry.isSecret) {
        if (!password || password.length < 4 || password.length > 32) {
            throw new Error('INVALID_SECRET_PASSWORD');
        }
        inquiry.passwordHash = hashPassword(password);
    }

    inquiries.unshift(inquiry);
    await writeInquiries(inquiries);

    return inquiry;
}

export async function unlockInquiry(
    id: string,
    password: string,
): Promise<Inquiry | null> {
    const inquiry = await getInquiryById(id);

    if (!inquiry || !inquiry.isSecret || !inquiry.passwordHash) {
        return null;
    }

    const isValid = verifyPassword(password, inquiry.passwordHash);

    return isValid ? inquiry : null;
}
