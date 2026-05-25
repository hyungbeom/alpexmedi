'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import styles from './product.module.css';

const TAGS = [
    'NON-ABLATIVE',
    'DUAL WAVELENGTH',
    'RESURFACING',
    'SCAR CARE',
    'STRIAE',
    'SOFTCOOL™',
] as const;

const GALLERY_IMAGES = [
    '/item/item1.png',
    '/item/item2.png',
    '/item/item3.png',
] as const;

const DEFAULT_TITLE = {bold: 'FraxPro', regular: 'Nordlys Mini'};
const SLIDE_ANIMATION_MS = 500;

function GalleryNavIcon({direction}: { direction: 'prev' | 'next' }) {
    const isPrev = direction === 'prev';

    return (
        <svg
            className={styles.navIcon}
            viewBox="0 0 96 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            {isPrev ? (
                <>
                    <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                    <line
                        x1="16"
                        y1="16"
                        x2="88"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                    <path
                        d="M16 16H8M8 16L12 13M8 16L12 19"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            ) : (
                <>
                    <circle
                        cx="80"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                    <line
                        x1="8"
                        y1="16"
                        x2="80"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                    <path
                        d="M80 16H88M88 16L84 13M88 16L84 19"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            )}
        </svg>
    );
}

type SlideDirection = 'prev' | 'next';

export default function ProductPageContent() {
    const searchParams = useSearchParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState<SlideDirection>('next');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const titleBold = searchParams.get('name') ?? DEFAULT_TITLE.bold;
    const titleRegular = searchParams.get('subtitle') ?? DEFAULT_TITLE.regular;

    const prevIndex = (activeIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    const nextIndex = (activeIndex + 1) % GALLERY_IMAGES.length;

    const slides = useMemo(
        () => ({
            prev: GALLERY_IMAGES[prevIndex],
            current: GALLERY_IMAGES[activeIndex],
            next: GALLERY_IMAGES[nextIndex],
        }),
        [activeIndex, prevIndex, nextIndex],
    );

    const goToSlide = (index: number, direction: SlideDirection) => {
        if (index === activeIndex || isTransitioning) {
            return;
        }

        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
        }

        setSlideDirection(direction);
        setActiveIndex(index);
        setIsTransitioning(true);

        transitionTimerRef.current = setTimeout(() => {
            setIsTransitioning(false);
            transitionTimerRef.current = null;
        }, SLIDE_ANIMATION_MS);
    };

    const centerEnterClass =
        slideDirection === 'next' ? styles.centerEnterNext : styles.centerEnterPrev;

    useEffect(() => {
        return () => {
            if (transitionTimerRef.current) {
                clearTimeout(transitionTimerRef.current);
            }
        };
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.inner}>
                <ul className={styles.tags}>
                    {TAGS.map((tag) => (
                        <li key={tag} className={styles.tag}>
                            {tag}
                        </li>
                    ))}
                </ul>

                <h1 className={styles.title}>
                    <span className={styles.titleBold}>{titleBold}</span>{' '}
                    <span className={styles.titleRegular}>{titleRegular}</span>
                </h1>

            </div>

            <div className={styles.galleryWrap}>
                <div className={styles.stage}>
                    <div className={styles.sideSlot}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={slides.prev}
                            src={slides.prev}
                            alt=""
                            className={`${styles.sideImage} ${styles.sideEnter}`}
                        />
                    </div>

                    <div className={styles.centerBlock}>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={() => goToSlide(prevIndex, 'prev')}
                            disabled={isTransitioning}
                            aria-label="이전 제품 이미지"
                        >
                            <GalleryNavIcon direction="prev"/>
                        </button>

                        <div className={styles.centerSlot}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                key={slides.current}
                                src={slides.current}
                                alt={titleBold}
                                className={`${styles.centerImage} ${centerEnterClass}`}
                            />
                            <div className={styles.centerGradient} aria-hidden/>
                        </div>

                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={() => goToSlide(nextIndex, 'next')}
                            disabled={isTransitioning}
                            aria-label="다음 제품 이미지"
                        >
                            <GalleryNavIcon direction="next"/>
                        </button>
                    </div>

                    <div className={styles.sideSlot}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={slides.next}
                            src={slides.next}
                            alt=""
                            className={`${styles.sideImage} ${styles.sideEnter}`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
