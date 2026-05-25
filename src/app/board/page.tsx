import styles from '../shared/pageShell.module.css';

export default function BoardPage() {
    return (
        <section className={styles.page}>
            <h1 className={styles.label}>BOARD</h1>
            <p className={styles.description}>
                알펙스메디의 소식과 공지사항을 확인하실 수 있습니다.
            </p>
        </section>
    );
}
