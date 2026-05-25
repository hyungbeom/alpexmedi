'use client';

import Link from 'next/link';
import {forwardRef} from 'react';
import styles from './ProductDetailSection.module.css';

const HERO_IMAGE = '/item/item1.png';

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
                        <span className={styles.titleBold}>{data.titleBold}</span>
                        <span className={styles.titleRegular}>{data.titleRegular}</span>
                    </h2>
                    <div className={styles.divider}/>
                    <Link
                        href={{
                            pathname: '/product',
                            query: {
                                name: data.titleBold,
                                subtitle: data.titleRegular,
                            },
                        }}
                        className={styles.detailLink}
                    >
                        상세보기
                    </Link>
                </div>

                <div className={styles.hero}>
                    <div className={styles.heroImageWrap}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={HERO_IMAGE}
                            alt={data.titleBold}
                            className={styles.heroImage}
                        />
                        <div className={styles.heroGradient} aria-hidden/>
                        {data.heroOverlay ? (
                            <p className={styles.heroOverlay}>{data.heroOverlay}</p>
                        ) : null}
                    </div>
                </div>

                <div className={styles.middle}>
                    <Link href="/contact" className={styles.inquiryButton}>
                        문의하기
                    </Link>
                    <p className={styles.longDescription}>{data.longDescription}</p>
                </div>

                <ul className={styles.features} style={{paddingTop : 50}}>
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
