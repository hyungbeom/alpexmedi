'use client';

import ProductDetailSection, {
    ProductDetailData,
} from '@/component/products/ProductDetailSection';
import Image from 'next/image';
import {useEffect, useMemo, useRef, useState} from 'react';
import styles from './products.module.css';

type Category = 'ALL' | '의료' | '피부';

type Product = {
    id: number;
    name: string;
    description: string;
    image: string;
    category: Exclude<Category, 'ALL'>;
    detail: ProductDetailData;
};

const FILTERS: Category[] = ['ALL', '의료', '피부'];

const DEFAULT_DETAIL: Omit<ProductDetailData, 'titleBold'> = {
    brand: 'CANDELA',
    titleRegular: 'Nordlys Mini',
    heroImage: '/item/item1.png',
    heroOverlay: 'The smart way to Frax',
    longDescription:
        'Non-ablative Frax 1550™ and Frax 1940™ technologies for an optimized approach to skin resurfacing, acne scars, surgical scars, striae and actinic keratosis !',
    features: [
        {label: 'Innovative', icon: 'innovative'},
        {label: 'Clinically-minded', icon: 'clinical'},
        {label: 'Practice-oriented', icon: 'practice'},
        {label: 'Ease of use', icon: 'ease'},
    ],
};

const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'PLAZION',
        description: '4th Generation Portable Plasma innovated Across Generations',
        image: '/model/model1.png',
        category: '의료',
        detail: {...DEFAULT_DETAIL, titleBold: 'FraxPro'},
    },
    {
        id: 2,
        name: 'CoolSoniq',
        description: 'Perfect Harmony of Ultrasound and Continuous Cooling',
        image: '/model/model2.png',
        category: '피부',
        detail: {...DEFAULT_DETAIL, titleBold: 'CoolSoniq'},
    },
    {
        id: 3,
        name: 'COOLFASE',
        description: 'Monopolar RF with Patented Cooling Technology',
        image: '/model/model3.png',
        category: '피부',
        detail: {...DEFAULT_DETAIL, titleBold: 'COOLFASE'},
    },
    {
        id: 4,
        name: 'LIFTERA 2',
        description: 'Next-Generation Lifting Solution with Advanced HIFU',
        image: '/model/model4.png',
        category: '피부',
        detail: {...DEFAULT_DETAIL, titleBold: 'LIFTERA 2'},
    },
    {
        id: 5,
        name: 'ULTLINE',
        description: 'Ideal Body Line Completed with Precision Contouring',
        image: '/model/model5.png',
        category: '피부',
        detail: {...DEFAULT_DETAIL, titleBold: 'ULTLINE'},
    },
    {
        id: 6,
        name: 'GentleMax Pro Plus',
        description: 'Global Dual-Wavelength Laser Platform',
        image: '/model/model6.png',
        category: '의료',
        detail: {...DEFAULT_DETAIL, titleBold: 'GentleMax Pro Plus'},
    },
    {
        id: 7,
        name: 'CELLVIBE',
        description: 'Elasticity and Lifting Simultaneously in One System',
        image: '/model/model7.png',
        category: '피부',
        detail: {...DEFAULT_DETAIL, titleBold: 'CELLVIBE'},
    },
    {
        id: 8,
        name: 'WINNAGE',
        description: 'Differentiated Anti-Aging Total Care Solution',
        image: '/model/model8.png',
        category: '의료',
        detail: {...DEFAULT_DETAIL, titleBold: 'WINNAGE'},
    },
];

export default function ProductsPage() {
    const [activeFilter, setActiveFilter] = useState<Category>('ALL');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const detailRef = useRef<HTMLElement>(null);

    const filteredProducts = useMemo(() => {
        if (activeFilter === 'ALL') return PRODUCTS;
        return PRODUCTS.filter((product) => product.category === activeFilter);
    }, [activeFilter]);

    const selectedProduct = useMemo(
        () => PRODUCTS.find((product) => product.id === selectedProductId) ?? null,
        [selectedProductId],
    );

    const handleCardClick = (productId: number) => {
        setSelectedProductId((prev) => (prev === productId ? null : productId));
    };

    useEffect(() => {
        if (selectedProductId === null) return;

        const timer = window.setTimeout(() => {
            detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 80);

        return () => window.clearTimeout(timer);
    }, [selectedProductId]);

    return (
        <>
            <section className={styles.page}>
                <h1 className={styles.label}>PRODUCT</h1>

                <nav className={styles.filters} aria-label="제품 카테고리">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            className={`${styles.filter} ${
                                activeFilter === filter ? styles.filterActive : ''
                            }`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </nav>

                <ul className={styles.grid}>
                    {filteredProducts.map((product) => (
                        <li key={product.id}>
                            <button
                                type="button"
                                className={`${styles.card} ${
                                    selectedProductId === product.id ? styles.cardSelected : ''
                                }`}
                                onClick={() => handleCardClick(product.id)}
                                aria-expanded={selectedProductId === product.id}
                            >
                                <div className={styles.imageWrap}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 767px) 45vw, (max-width: 1023px) 45vw, 25vw"
                                    />
                                </div>
                                <span className={styles.name}>{product.name}</span>
                                <span className={styles.description}>{product.description}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {selectedProduct && (
                <ProductDetailSection ref={detailRef} data={selectedProduct.detail}/>
            )}
        </>
    );
}
