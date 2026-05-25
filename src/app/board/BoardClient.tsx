'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from './board.module.css';
import type {Inquiry} from '@/types/inquiry';

type InquiryListItem = Pick<Inquiry, 'id' | 'title' | 'author' | 'createdAt'>;

type BoardClientProps = {
    initialInquiries: InquiryListItem[];
};

type FormState = {
    title: string;
    author: string;
    email: string;
    phone: string;
    content: string;
};

const EMPTY_FORM: FormState = {
    title: '',
    author: '',
    email: '',
    phone: '',
    content: '',
};

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(iso));
}

export default function BoardClient({initialInquiries}: BoardClientProps) {
    const router = useRouter();
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState('');

    const updateField = (field: keyof FormState, value: string) => {
        setForm((prev) => ({...prev, [field]: value}));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError('');
        setFormSuccess('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.error ?? '문의 등록에 실패했습니다.');
                return;
            }

            setForm(EMPTY_FORM);
            setFormSuccess('문의가 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.');
            setShowForm(false);

            if (data.inquiry) {
                setInquiries((prev) => [data.inquiry as InquiryListItem, ...prev]);
            }

            router.refresh();
        } catch {
            setFormError('문의 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDetail = async (id: string) => {
        if (selectedId === id) {
            setSelectedId(null);
            setSelectedInquiry(null);
            setDetailError('');
            return;
        }

        setSelectedId(id);
        setSelectedInquiry(null);
        setDetailError('');
        setIsLoadingDetail(true);

        try {
            const response = await fetch(`/api/inquiries/${id}`);
            const data = await response.json();

            if (!response.ok) {
                setDetailError(data.error ?? '문의 내용을 불러오지 못했습니다.');
                return;
            }

            setSelectedInquiry(data.inquiry as Inquiry);
        } catch {
            setDetailError('문의 내용을 불러오지 못했습니다.');
        } finally {
            setIsLoadingDetail(false);
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.label}>BOARD</h1>
                    <p className={styles.description}>
                        제품 및 서비스에 대한 문의를 남겨 주시면 확인 후 연락드리겠습니다.
                    </p>
                </div>
                <button
                    type="button"
                    className={`${styles.writeButton} ${
                        showForm ? styles.writeButtonSecondary : ''
                    }`}
                    onClick={() => {
                        setShowForm((open) => !open);
                        setFormError('');
                        setFormSuccess('');
                    }}
                >
                    {showForm ? '목록 보기' : '문의 작성'}
                </button>
            </div>

            {showForm && (
                <div className={styles.formPanel}>
                    <h2 className={styles.formTitle}>문의 작성</h2>

                    {formError && (
                        <p className={styles.errorMessage} role="alert">
                            {formError}
                        </p>
                    )}
                    {formSuccess && (
                        <p className={styles.successMessage} role="status">
                            {formSuccess}
                        </p>
                    )}

                    <form className={styles.formGrid} onSubmit={handleSubmit}>
                        <div className={`${styles.field} ${styles.fieldFull}`}>
                            <label htmlFor="inquiry-title">제목</label>
                            <input
                                id="inquiry-title"
                                name="title"
                                type="text"
                                required
                                maxLength={120}
                                value={form.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="문의 제목을 입력해 주세요"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="inquiry-author">이름</label>
                            <input
                                id="inquiry-author"
                                name="author"
                                type="text"
                                required
                                maxLength={40}
                                value={form.author}
                                onChange={(e) => updateField('author', e.target.value)}
                                placeholder="이름"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="inquiry-email">이메일</label>
                            <input
                                id="inquiry-email"
                                name="email"
                                type="email"
                                required
                                maxLength={120}
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="inquiry-phone">연락처 (선택)</label>
                            <input
                                id="inquiry-phone"
                                name="phone"
                                type="tel"
                                maxLength={30}
                                value={form.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                placeholder="010-0000-0000"
                            />
                        </div>

                        <div className={`${styles.field} ${styles.fieldFull}`}>
                            <label htmlFor="inquiry-content">문의 내용</label>
                            <textarea
                                id="inquiry-content"
                                name="content"
                                required
                                maxLength={5000}
                                value={form.content}
                                onChange={(e) => updateField('content', e.target.value)}
                                placeholder="문의하실 내용을 자세히 작성해 주세요"
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => setShowForm(false)}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '등록 중…' : '문의 등록'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.boardPanel}>
                <div className={styles.boardMeta}>
                    <span>총 {inquiries.length}건</span>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.colNo}>번호</th>
                                <th>제목</th>
                                <th className={styles.colAuthor}>작성자</th>
                                <th className={styles.colDate}>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className={styles.emptyState}>
                                        등록된 문의가 없습니다. 첫 문의를 작성해 보세요.
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className={styles.colNo}>
                                            {inquiries.length - index}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className={styles.rowButton}
                                                onClick={() => openDetail(item.id)}
                                            >
                                                <span className={styles.rowTitle}>
                                                    {item.title}
                                                </span>
                                            </button>
                                        </td>
                                        <td className={styles.colAuthor}>{item.author}</td>
                                        <td className={styles.colDate}>
                                            {formatDate(item.createdAt)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedId && (
                    <div className={styles.detailPanel}>
                        <div className={styles.detailHeader}>
                            {selectedInquiry ? (
                                <>
                                    <div>
                                        <h3 className={styles.detailTitle}>
                                            {selectedInquiry.title}
                                        </h3>
                                        <p className={styles.detailMeta}>
                                            {selectedInquiry.author} ·{' '}
                                            {formatDate(selectedInquiry.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.closeDetail}
                                        onClick={() => {
                                            setSelectedId(null);
                                            setSelectedInquiry(null);
                                        }}
                                    >
                                        닫기
                                    </button>
                                </>
                            ) : (
                                <p className={styles.detailMeta}>
                                    {isLoadingDetail
                                        ? '불러오는 중…'
                                        : detailError || '문의 내용을 불러오지 못했습니다.'}
                                </p>
                            )}
                        </div>

                        {selectedInquiry && (
                            <>
                                <p className={styles.detailContent}>
                                    {selectedInquiry.content}
                                </p>
                                <div className={styles.detailContact}>
                                    <span>이메일: {selectedInquiry.email}</span>
                                    {selectedInquiry.phone && (
                                        <span>연락처: {selectedInquiry.phone}</span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
