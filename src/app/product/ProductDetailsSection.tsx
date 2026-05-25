import styles from './productDetails.module.css';

const INFO_IMAGES = [
    {src: '/item/info1.png', alt: 'Innovative'},
    {src: '/item/info2.png', alt: 'Clinically-minded minimal design'},
    {src: '/item/info3.png', alt: 'Practice-oriented'},
    {src: '/item/info4.png', alt: 'Ease of use'},
] as const;

export default function ProductDetailsSection() {
    return (
        <section className={styles.section} aria-labelledby="product-details-title">
            <header className={styles.header}>
                <p className={styles.label}>Product Details</p>
                <span className={styles.divider} aria-hidden/>
                <h2 id="product-details-title" className={styles.heading}>
                    The smart way to Frax
                </h2>
                <p className={styles.description}>
                    Non-ablative Frax 1550™ and Frax 1940™ technologies for an optimized
                    approach to skin resurfacing, acne scars, surgical scars, striae and
                    actinic keratosis<sup>1</sup>
                </p>
            </header>

            <div className={styles.grid}>
                {INFO_IMAGES.map((image) => (
                    <figure key={image.src} className={styles.gridItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.src}
                            alt={image.alt}
                            className={styles.gridImage}
                        />
                    </figure>
                ))}
            </div>

            <p className={styles.footer}>
                Backed by the professional team at Candela, with extensive clinical
                trainers, experienced service staff, and marketing support.
            </p>
        </section>
    );
}
