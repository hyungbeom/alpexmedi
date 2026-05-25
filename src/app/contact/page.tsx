import styles from '../shared/pageShell.module.css';

export default function ContactPage() {
    return (
        <section className={styles.page}>
            <h1 className={styles.label}>CONTACT</h1>
            <p className={styles.description}>
                제품 문의 및 상담을 원하시면 아래 연락처로 문의해 주세요.
            </p>
            <ul className={styles.contactList}>
                <li>
                    <span className={styles.contactKey}>이메일</span>
                    <span>almed3119@naver.com</span>
                </li>
                <li>
                    <span className={styles.contactKey}>전화</span>
                    <span>070-8841-4143</span>
                </li>
                <li>
                    <span className={styles.contactKey}>주소</span>
                    <span>
                        11 Magokjungang 6-ro, Gangseo-gu,
                        <br />
                        Seoul, Botanic Park Tower 3rd, 315-50
                    </span>
                </li>
            </ul>
        </section>
    );
}
