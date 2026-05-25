import styles from './productExtended.module.css';

const CLINICAL_IMAGES = [
    {src: '/item/info5.png', alt: 'Clinical results — courtesy of K. Schallen, MD, USA'},
    {src: '/item/info6.png', alt: 'Clinical results — courtesy of K. Schallen, MD, USA'},
    {src: '/item/info7.png', alt: 'Clinical results — courtesy of E. Victor Ross, MD, USA'},
] as const;

const HANDPIECE_ROWS = [
    {
        label: 'Laser Wavelength',
        frax1550: '1550 nm',
        frax1940: '1940 nm',
    },
    {
        label: 'Energy Range/MTZ',
        frax1550: '5-100 mJ',
        frax1940: '5-20 mJ',
    },
    {
        label: 'Pulse Duration',
        frax1550: '1-20 ms',
        frax1940: '1.5-20 ms',
    },
    {
        label: 'Scan Width',
        frax1550: '4-12 mm',
        frax1940: '4-12 mm',
    },
    {
        label: 'Skin Cooling',
        shared: 'SoftCool™ Integrated Air Cooling',
    },
    {
        label: 'Aiming Beam',
        shared: '650 nm',
    },
    {
        label: 'Cable',
        shared: '3.2 m with flexible joint for user comfort',
    },
] as const;

const CONSOLE_ROWS = [
    {
        label: 'Dimensions (D x W x H)',
        value: '17" x 16.5" x 42" (43 cm x 42 cm x 107 cm)',
    },
    {label: 'Shipping Weight', value: '53 lbs (24 kg)'},
    {label: 'Electrical Input', value: '100-240 VAC'},
    {label: 'Frequency', value: '50/60 Hz'},
] as const;

const FEATURE_COLUMNS = [
    ['1 connector', 'Accessories niche'],
    ['Touch screen 10"', 'Patient database'],
    ['Remote assistance', 'Guided treatment'],
] as const;

export default function ProductExtendedSection() {
    return (
        <section className={styles.section} aria-labelledby="clinical-results-title">
            <div className={styles.clinicalBlock}>
                <h2 id="clinical-results-title" className={styles.clinicalTitle}>
                    Clinically proven results
                </h2>

                <div className={styles.clinicalGrid}>
                    {CLINICAL_IMAGES.map((image) => (
                        <figure key={image.src} className={styles.clinicalItem}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={image.src}
                                alt={image.alt}
                                className={styles.clinicalImage}
                            />
                        </figure>
                    ))}
                </div>
            </div>

            <h2 className={styles.productName}>
                <span className={styles.productNameBold}>FraxPro</span>{' '}
                <span className={styles.productNameRegular}>Nordlys Mini</span>
            </h2>

            <div className={styles.specsBlock}>
                <h3 className={styles.specsHeading}>SPECIFICATIONS</h3>
                <hr className={styles.specsRule}/>

                <div className={styles.specGroup}>
                    <h4 className={styles.specSubheading}>HANDPIECE</h4>
                    <div className={styles.tableWrap}>
                        <table className={styles.specTable}>
                            <thead>
                                <tr>
                                    <th scope="col" className={styles.specLabelCol}/>
                                    <th scope="col" className={styles.specValueCol}>
                                        FRAX 1550
                                    </th>
                                    <th scope="col" className={styles.specValueCol}>
                                        FRAX 1940
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {HANDPIECE_ROWS.map((row) => (
                                    <tr key={row.label}>
                                        <th scope="row" className={styles.rowLabel}>
                                            {row.label}
                                        </th>
                                        {'shared' in row ? (
                                            <td colSpan={2} className={styles.sharedValue}>
                                                {row.shared}
                                            </td>
                                        ) : (
                                            <>
                                                <td>{row.frax1550}</td>
                                                <td>{row.frax1940}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.specGroup}>
                    <h4 className={styles.specSubheading}>CONSOLE SPECIFICATIONS</h4>
                    <div className={styles.tableWrap}>
                        <table className={`${styles.specTable} ${styles.consoleTable}`}>
                            <tbody>
                                {CONSOLE_ROWS.map((row) => (
                                    <tr key={row.label}>
                                        <th scope="row" className={styles.rowLabel}>
                                            {row.label}
                                        </th>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.specGroup}>
                    <h4 className={styles.specSubheading}>FEATURES</h4>
                    <div className={styles.featuresGrid}>
                        {FEATURE_COLUMNS.map((column) => (
                            <ul key={column[0]} className={styles.featuresList}>
                                {column.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
