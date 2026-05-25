import styles from './contact.module.css';

const ADDRESS =
    '11 Magokjungang 6-ro, Gangseo-gu, Seoul, Botanic Park Tower 3rd, 315-50';
const PHONE = '070-8841-4143';
const EMAIL = 'almed3119@naver.com';

function getGoogleMapEmbedUrl() {
    const customEmbed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
    if (customEmbed) {
        return customEmbed;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
        const params = new URLSearchParams({
            key: apiKey,
            q: ADDRESS,
            language: 'ko',
            zoom: '15',
        });
        return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
    }

    const query = encodeURIComponent(ADDRESS);
    return `https://maps.google.com/maps?q=${query}&hl=ko&z=16&ie=UTF8&iwloc=&output=embed`;
}

const CONTACT_CARDS = [
    {
        title: 'Address',
        content: ADDRESS,
        icon: 'location' as const,
    },
    {
        title: 'Phone',
        content: PHONE,
        icon: 'phone' as const,
    },
    {
        title: 'Email',
        content: EMAIL,
        icon: 'email' as const,
    },
] as const;

function ContactIcon({type}: {type: (typeof CONTACT_CARDS)[number]['icon']}) {
    switch (type) {
        case 'location':
            return (
                <svg
                    className={styles.cardIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <path
                        d="M12 21s-6-4.35-6-9a6 6 0 1112 0c0 4.65-6 9-6 9z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </svg>
            );
        case 'phone':
            return (
                <svg
                    className={styles.cardIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <rect
                        x="7"
                        y="3"
                        width="10"
                        height="18"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <circle cx="12" cy="18" r="0.75" fill="currentColor"/>
                </svg>
            );
        case 'email':
            return (
                <svg
                    className={styles.cardIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M3 7l9 6 9-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </svg>
            );
    }
}

export default function ContactPage() {
    const mapSrc = getGoogleMapEmbedUrl();

    return (
        <section className={styles.page}>
            <div className={styles.titleWrap}>
                <h1 className={styles.label}>LOCATION</h1>
            </div>

            <div className={styles.mapSection}>
                <iframe
                    className={styles.mapFrame}
                    src={mapSrc}
                    title="알펙스메디 위치 — Google Maps"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />

                <div className={styles.cardsRow}>
                    {CONTACT_CARDS.map((card) => (
                        <article key={card.title} className={styles.card}>
                            <ContactIcon type={card.icon}/>
                            <h2 className={styles.cardTitle}>{card.title}</h2>
                            <p className={styles.cardText}>
                                {card.icon === 'email' ? (
                                    <a href={`mailto:${card.content}`}>
                                        {card.content}
                                    </a>
                                ) : card.icon === 'phone' ? (
                                    <a href={`tel:${card.content.replace(/-/g, '')}`}>
                                        {card.content}
                                    </a>
                                ) : (
                                    card.content
                                )}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
