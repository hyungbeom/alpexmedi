import Image from 'next/image';
import styles from './PartnerMarquee.module.css';

type Partner = {
    src: string;
    alt: string;
};

export default function PartnerMarquee({partners}: { partners: Partner[] }) {
    const marqueeItems = [...partners, ...partners];

    return (
        <>
            <div className={styles.marquee}>
                <div className={styles.track}>
                    {marqueeItems.map((partner, index) => (
                        <Image
                            key={`marquee-${partner.src}-${index}`}
                            src={partner.src}
                            alt={partner.alt}
                            width={200}
                            height={60}
                            className={styles.logo}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.grid} aria-label="파트너사">
                {partners.map((partner) => (
                    <Image
                        key={partner.src}
                        src={partner.src}
                        alt={partner.alt}
                        width={160}
                        height={48}
                        className={styles.gridLogo}
                    />
                ))}
            </div>
        </>
    );
}
