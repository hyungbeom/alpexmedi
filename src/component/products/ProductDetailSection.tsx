'use client';

import Image from 'next/image';
import {forwardRef} from 'react';
import styles from './ProductDetailSection.module.css';

export type ProductDetailData = {
    brand: string;
    titleBold: string;
    titleRegular: string;
    heroImage: string;
    heroOverlay: string;
    longDescription: string;
    features: {label: string; icon: 'innovative' | 'clinical' | 'practice' | 'ease'}[];
};

type ProductDetailSectionProps = {
    data: ProductDetailData;
};

function FeatureIcon({type}: { type: ProductDetailData['features'][number]['icon'] }) {
    switch (type) {
        case 'innovative':
            return (
                <svg viewBox="0 0 24 24" aria-hidden>
                    <path
                        d="M9 18h6v-2H9v2zm3-14a7 7 0 00-4 12.74V17h8v-.26A7 7 0 0012 4z"
                        fill="currentColor"
                    />
                </svg>
            );
        case 'clinical':
            return (
                <svg viewBox="0 0 24 24" aria-hidden>
                    <path
                        d="M6 4h12v2H6V4zm0 4h8v2H6V8zm10 0h2v10h-2v-2h-2v2h-2V8h2V6h2v2z"
                        fill="currentColor"
                    />
                </svg>
            );
        case 'practice':
            return (
                <svg viewBox="0 0 24 24" aria-hidden>
                    <path
                        d="M12 21s-6-4.35-6-9a6 6 0 1112 0c0 4.65-6 9-6 9zm0-7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                        fill="currentColor"
                    />
                </svg>
            );
        case 'ease':
            return (
                <svg viewBox="0 0 24 24" aria-hidden>
                    <path
                        d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                        fill="currentColor"
                    />
                </svg>
            );
    }
}

const ProductDetailSection = forwardRef<HTMLElement, ProductDetailSectionProps>(
    function ProductDetailSection({data}, ref) {
        return (
            <section ref={ref} className={styles.section}>
                <div className={styles.header}>
                    <p className={styles.brand}>{data.brand}</p>
                    <h2 className={styles.title}>
                        <span className={styles.titleBold}>{data.titleBold}</span>{' '}
                        <span>{data.titleRegular}</span>
                    </h2>
                    <div className={styles.divider}/>
                    <button type="button" className={styles.detailLink}>
                        상세보기
                    </button>
                </div>

                <div className={styles.hero}>
                    <span className={`${styles.corner} ${styles.cornerTl}`}/>
                    <span className={`${styles.corner} ${styles.cornerTr}`}/>
                    <span className={`${styles.corner} ${styles.cornerBl}`}/>
                    <span className={`${styles.corner} ${styles.cornerBr}`}/>

                    <div className={styles.heroImageWrap}>
                        <Image
                            src={data.heroImage}
                            alt={data.titleBold}
                            fill
                            className={styles.heroImage}
                            sizes="(max-width: 767px) 90vw, 560px"
                            priority
                        />
                        <p className={styles.heroOverlay}>{data.heroOverlay}</p>
                    </div>
                </div>

                <div className={styles.middle}>
                    <button type="button" className={styles.inquiryButton}>
                        문의하기
                    </button>
                    <p className={styles.longDescription}>{data.longDescription}</p>
                </div>

                <ul className={styles.features}>
                    {data.features.map((feature) => (
                        <li key={feature.label} className={styles.featureCard}>
                            <span className={styles.featureIcon}>
                                <FeatureIcon type={feature.icon}/>
                            </span>
                            <span className={styles.featureLabel}>{feature.label}</span>
                        </li>
                    ))}
                </ul>
            </section>
        );
    },
);

export default ProductDetailSection;
