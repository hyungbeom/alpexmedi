import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.social}>
                <Image
                    src="/youtube.svg"
                    alt="youtube"
                    width={24}
                    height={24}
                    className={styles.socialIcon}
                />
                <Image
                    src="/instagram.svg"
                    alt="instagram"
                    width={24}
                    height={24}
                    className={styles.socialIcon}
                />
            </div>

            <div className={styles.info}>
                <div className={styles.desktopRow}>
                    <p className={styles.company}>주식회사 알펙스메디 &nbsp;|&nbsp; 대표자명</p>
                    <div className={styles.legalDesktop}>
                        <span className={styles.legalBold}>개인정보 처리방침</span>
                        <span>이용약관</span>
                    </div>
                </div>

                <p className={styles.companyMobile}>주식회사 알펙스메디 &nbsp;|&nbsp; 대표자명</p>

                <div className={styles.infoBody}>
                    <p className={styles.infoLine}>11 Magokjungang 6-ro, Gangseo-gu,</p>
                    <p className={styles.infoLine}>Seoul, Botanic Park Tower 3rd, 315-50</p>
                    <p className={styles.infoLine}>almed3119@naver.com</p>
                    <p className={styles.infoLine}>070-8841-4143</p>
                    <p className={styles.infoLine}>사업자 등록번호 &nbsp; 123-45-67890</p>
                </div>
            </div>

            <div className={styles.legalMobile}>
                <span className={styles.legalBold}>개인정보 처리방침</span>
                <span>이용약관</span>
            </div>

            <p className={styles.copyright}>
                COPYRIGHTS © 2026 ALPEXMEDI ALL RIGHTS RESERVED.
            </p>
        </footer>
    );
}
