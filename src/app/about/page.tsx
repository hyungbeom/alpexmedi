import Image from 'next/image';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <section className={styles.page}>
            <p className={styles.label}>ABOUT</p>

            <div className={styles.grid}>
                <h1 className={styles.brand}>
                    <span className={styles.brandHighlight}>ALPEX</span>
                    <span>MEDI</span>
                </h1>

                <div className={styles.textCol}>
                    <p className={styles.paragraph}>
                        In the rapidly changing medical environment, we aim to improve the
                        quality of medical services and present new medical solutions, considering
                        both <span className={styles.highlight}>patient-centered</span> values and
                        the efficiency of medical institutions.
                    </p>

                    <p className={styles.paragraph}>
                        Alpexmedi strives to contribute to the advancement of the medical industry
                        through continuous research and professional networks, and to be a partner
                        that <span className={styles.highlight}>grows together</span> with our
                        customers.
                    </p>
                </div>

                <div className={styles.bubbles}>
                    <Image
                        src="/bubble1.png"
                        alt=""
                        width={400}
                        height={300}
                        className={styles.bubble1}
                        sizes="(max-width: 767px) 50vw, 280px"
                        priority
                    />
                    <Image
                        src="/bubble2.png"
                        alt=""
                        width={360}
                        height={280}
                        className={styles.bubble2}
                        sizes="(max-width: 767px) 55vw, 320px"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
