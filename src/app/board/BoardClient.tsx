'use client';

import {FormEvent, useEffect, useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import styles from './board.module.css';
import type {InquiryListItem, PublicInquiry} from '@/types/inquiry';

type BoardClientProps = {
    initialInquiries: InquiryListItem[];
};

type FormState = {
    title: string;
    author: string;
    email: string;
    phone: string;
    content: string;
    isSecret: boolean;
    password: string;
    passwordConfirm: string;
};

const EMPTY_FORM: FormState = {
    title: '',
    author: '',
    email: '',
    phone: '',
    content: '',
    isSecret: false,
    password: '',
    passwordConfirm: '',
};

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(iso));
}

function shouldOpenWriteForm(searchParams: URLSearchParams) {
    const write = searchParams.get('write');
    return write === '1' || write === 'true';
}

export default function BoardClient({initialInquiries}: BoardClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const formPanelRef = useRef<HTMLDivElement>(null);
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [showForm, setShowForm] = useState(() =>
        shouldOpenWriteForm(searchParams),
    );
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<PublicInquiry | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState('');
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [unlockPassword, setUnlockPassword] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlockError, setUnlockError] = useState('');

    useEffect(() => {
        if (!shouldOpenWriteForm(searchParams)) {
            return;
        }

        setShowForm(true);

        const timer = window.setTimeout(() => {
            formPanelRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);

        return () => window.clearTimeout(timer);
    }, [searchParams]);

    const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm((prev) => ({...prev, [field]: value}));
    };

    const resetDetail = () => {
        setSelectedId(null);
        setSelectedInquiry(null);
        setDetailError('');
        setRequiresPassword(false);
        setUnlockPassword('');
        setUnlockError('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError('');
        setFormSuccess('');

        if (form.isSecret) {
            if (form.password.length < 4 || form.password.length > 32) {
                setFormError('비밀번호는 4~32자로 입력해 주세요.');
                return;
            }
            if (form.password !== form.passwordConfirm) {
                setFormError('비밀번호 확인이 일치하지 않습니다.');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: form.title,
                    author: form.author,
                    email: form.email,
                    phone: form.phone,
                    content: form.content,
                    isSecret: form.isSecret,
                    password: form.isSecret ? form.password : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.error ?? '문의 등록에 실패했습니다.');
                return;
            }

            setForm(EMPTY_FORM);
            setFormSuccess(
                form.isSecret
                    ? '비밀글이 등록되었습니다. 목록에서 제목을 누르고 비밀번호를 입력해 확인할 수 있습니다.'
                    : '문의가 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.',
            );
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

    const openDetail = async (item: InquiryListItem) => {
        if (selectedId === item.id) {
            resetDetail();
            return;
        }

        setSelectedId(item.id);
        setSelectedInquiry(null);
        setDetailError('');
        setRequiresPassword(false);
        setUnlockPassword('');
        setUnlockError('');
        setIsLoadingDetail(true);

        try {
            const response = await fetch(`/api/inquiries/${item.id}`);
            const data = await response.json();

            if (!response.ok) {
                setDetailError(data.error ?? '문의 내용을 불러오지 못했습니다.');
                return;
            }

            if (data.requiresPassword) {
                setRequiresPassword(true);
                return;
            }

            setSelectedInquiry(data.inquiry as PublicInquiry);
        } catch {
            setDetailError('문의 내용을 불러오지 못했습니다.');
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedId) return;

        setUnlockError('');
        setIsUnlocking(true);

        try {
            const response = await fetch(`/api/inquiries/${selectedId}/unlock`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({password: unlockPassword}),
            });

            const data = await response.json();

            if (!response.ok) {
                setUnlockError(data.error ?? '비밀번호가 일치하지 않습니다.');
                return;
            }

            setSelectedInquiry(data.inquiry as PublicInquiry);
            setRequiresPassword(false);
            setUnlockPassword('');
        } catch {
            setUnlockError('비밀번호 확인 중 오류가 발생했습니다.');
        } finally {
            setIsUnlocking(false);
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.label}>BOARD</h1>
                    <p className={styles.description}>
                        제품 및 서비스에 대한 문의를 남겨 주시면 확인 후 연락드리겠습니다.
                        비밀글은 작성 시 설정한 비밀번호로만 열람할 수 있습니다.
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
                <div ref={formPanelRef} className={styles.formPanel}>
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
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={form.isSecret}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        updateField('isSecret', checked);
                                        if (!checked) {
                                            updateField('password', '');
                                            updateField('passwordConfirm', '');
                                        }
                                    }}
                                />
                                <span>비밀글로 작성</span>
                            </label>
                            <p className={styles.fieldHint}>
                                비밀글은 목록에만 표시되며, 비밀번호를 아는 분만 내용을
                                확인할 수 있습니다.
                            </p>
                        </div>

                        {form.isSecret && (
                            <>
                                <div className={styles.field}>
                                    <label htmlFor="inquiry-password">비밀번호</label>
                                    <input
                                        id="inquiry-password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={4}
                                        maxLength={32}
                                        value={form.password}
                                        onChange={(e) =>
                                            updateField('password', e.target.value)
                                        }
                                        placeholder="4~32자"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="inquiry-password-confirm">
                                        비밀번호 확인
                                    </label>
                                    <input
                                        id="inquiry-password-confirm"
                                        name="passwordConfirm"
                                        type="password"
                                        required
                                        minLength={4}
                                        maxLength={32}
                                        value={form.passwordConfirm}
                                        onChange={(e) =>
                                            updateField('passwordConfirm', e.target.value)
                                        }
                                        placeholder="비밀번호 재입력"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </>
                        )}

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
                                                onClick={() => openDetail(item)}
                                            >
                                                {item.isSecret && (
                                                    <span className={styles.secretBadge}>
                                                        🔒
                                                    </span>
                                                )}
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
                        {requiresPassword && !selectedInquiry ? (
                            <>
                                <div className={styles.detailHeader}>
                                    <div>
                                        <p className={styles.secretLabel}>비밀글</p>
                                        <h3 className={styles.detailTitle}>
                                            비밀번호를 입력해 주세요
                                        </h3>
                                        <p className={styles.detailMeta}>
                                            작성 시 설정한 비밀번호로만 내용을 확인할 수
                                            있습니다.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.closeDetail}
                                        onClick={resetDetail}
                                    >
                                        닫기
                                    </button>
                                </div>

                                <form
                                    className={styles.unlockForm}
                                    onSubmit={handleUnlock}
                                >
                                    {unlockError && (
                                        <p className={styles.errorMessage} role="alert">
                                            {unlockError}
                                        </p>
                                    )}
                                    <div className={styles.field}>
                                        <label htmlFor="unlock-password">비밀번호</label>
                                        <input
                                            id="unlock-password"
                                            type="password"
                                            value={unlockPassword}
                                            onChange={(e) =>
                                                setUnlockPassword(e.target.value)
                                            }
                                            placeholder="비밀번호 입력"
                                            autoComplete="current-password"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={isUnlocking}
                                    >
                                        {isUnlocking ? '확인 중…' : '내용 보기'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className={styles.detailHeader}>
                                    {selectedInquiry ? (
                                        <>
                                            <div>
                                                {selectedInquiry.isSecret && (
                                                    <p className={styles.secretLabel}>
                                                        비밀글
                                                    </p>
                                                )}
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
                                                onClick={resetDetail}
                                            >
                                                닫기
                                            </button>
                                        </>
                                    ) : (
                                        <p className={styles.detailMeta}>
                                            {isLoadingDetail
                                                ? '불러오는 중…'
                                                : detailError ||
                                                  '문의 내용을 불러오지 못했습니다.'}
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
                                                <span>
                                                    연락처: {selectedInquiry.phone}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
