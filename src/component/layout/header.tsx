'use client';

import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styles from './header.module.css';

const NAV_ITEMS = [
    {label: 'HOME', href: '/'},
    {label: 'ABOUT', href: '/about'},
    {label: 'PRODUCTS', href: '/products'},
    {label: 'BOARD', href: '/board'},
    {label: 'CONTACT US', href: '/contact'},
] as const;

const TABLET_BREAKPOINT = 1024;

function MenuButton({
    isOpen,
    onClick,
    className,
}: {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ''} ${className ?? ''}`}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isOpen}
            onClick={onClick}
        >
            <span/>
            <span/>
            <span/>
        </button>
    );
}

export default function Header() {
    const pathname = usePathname();
    const [isCompact, setIsCompact] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const menuTopRef = useRef<HTMLDivElement>(null);
    const menuInnerRef = useRef<HTMLDivElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const langRef = useRef<HTMLDivElement>(null);
    const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

    const closeMenu = () => setIsMenuOpen(false);
    const showHeaderBar = !isCompact || !isMenuOpen;

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    useEffect(() => {
        const handleResize = () => {
            const compact = window.innerWidth < TABLET_BREAKPOINT;
            setIsCompact(compact);
            if (!compact) setIsMenuOpen(false);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const lockScroll = isMenuOpen && isCompact;

        document.body.style.overflow = lockScroll ? 'hidden' : '';
        document.documentElement.style.overflow = lockScroll ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isMenuOpen, isCompact]);

    useEffect(() => {
        closeMenu();
    }, [pathname]);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);

    useLayoutEffect(() => {
        if (!isCompact) return;

        const overlay = overlayRef.current;
        const menuTop = menuTopRef.current;
        const menuInner = menuInnerRef.current;
        const links = linkRefs.current.filter(Boolean);
        const lang = langRef.current;

        if (!overlay || !menuTop || !menuInner) return;

        menuTimelineRef.current?.kill();

        const ctx = gsap.context(() => {
            if (isMenuOpen) {
                gsap.set(overlay, {
                    visibility: 'visible',
                    pointerEvents: 'auto',
                });

                menuTimelineRef.current = gsap
                    .timeline({defaults: {ease: 'power3.out'}})
                    .fromTo(
                        overlay,
                        {opacity: 0},
                        {opacity: 1, duration: 0.4},
                    )
                    .fromTo(
                        menuTop,
                        {y: -24, opacity: 0},
                        {y: 0, opacity: 1, duration: 0.45},
                        '-=0.25',
                    )
                    .fromTo(
                        menuInner,
                        {y: 40, opacity: 0},
                        {y: 0, opacity: 1, duration: 0.5},
                        '-=0.3',
                    )
                    .fromTo(
                        links,
                        {y: 56, opacity: 0},
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.55,
                            stagger: 0.09,
                        },
                        '-=0.32',
                    )
                    .fromTo(
                        lang,
                        {y: 28, opacity: 0},
                        {y: 0, opacity: 1, duration: 0.4},
                        '-=0.2',
                    );
            } else {
                menuTimelineRef.current = gsap
                    .timeline({
                        defaults: {ease: 'power2.in'},
                        onComplete: () => {
                            gsap.set(overlay, {
                                visibility: 'hidden',
                                pointerEvents: 'none',
                            });
                        },
                    })
                    .to(lang, {y: 20, opacity: 0, duration: 0.2})
                    .to(
                        links,
                        {y: 36, opacity: 0, duration: 0.26, stagger: 0.05},
                        '-=0.1',
                    )
                    .to(menuInner, {y: 24, opacity: 0, duration: 0.24}, '-=0.12')
                    .to(menuTop, {y: -16, opacity: 0, duration: 0.22}, '-=0.15')
                    .to(overlay, {opacity: 0, duration: 0.3}, '-=0.08');
            }
        }, overlay);

        return () => {
            menuTimelineRef.current?.kill();
            ctx.revert();
        };
    }, [isMenuOpen, isCompact]);

    useLayoutEffect(() => {
        if (!isCompact || !overlayRef.current) return;

        gsap.set(overlayRef.current, {
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
        });
    }, [isCompact]);

    return (
        <div className={styles.headerShell}>
            {showHeaderBar && (
                <header className={styles.header}>
                    <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                        <Image
                            src="/logo.svg"
                            alt="alpexmedi_logo"
                            width={90}
                            height={40}
                        />
                    </Link>

                    <nav className={styles.nav}>
                        <div className={styles.navLinks}>
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navLink} ${
                                        isActive(item.href) ? styles.navLinkActive : ''
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className={styles.lang}>
                            <span>KR</span>
                            <span>EN</span>
                        </div>
                    </nav>

                    <div className={styles.compactActions}>
                        <button
                            type="button"
                            className={styles.langCompact}
                            aria-label="언어 선택"
                        >
                            EN
                        </button>
                        <MenuButton
                            isOpen={false}
                            onClick={() => setIsMenuOpen(true)}
                        />
                    </div>
                </header>
            )}

            {isCompact && (
                <div
                    ref={overlayRef}
                    className={styles.mobileOverlay}
                    aria-hidden={!isMenuOpen}
                    role="dialog"
                    aria-modal={isMenuOpen}
                >
                    <div className={styles.mobileOverlayInner}>
                        <div ref={menuTopRef} className={styles.mobileMenuTop}>
                            <Link
                                href="/"
                                className={styles.logoLink}
                                onClick={closeMenu}
                            >
                                <Image
                                    src="/logo.svg"
                                    alt="alpexmedi_logo"
                                    width={90}
                                    height={40}
                                />
                            </Link>
                            <MenuButton isOpen onClick={closeMenu}/>
                        </div>

                        <nav
                            className={styles.mobileMenu}
                            aria-label="모바일 메뉴"
                        >
                            <div ref={menuInnerRef} className={styles.mobileMenuInner}>
                                {NAV_ITEMS.map((item, index) => (
                                    <Link
                                        key={item.href}
                                        ref={(element) => {
                                            linkRefs.current[index] = element;
                                        }}
                                        href={item.href}
                                        className={`${styles.mobileNavLink} ${
                                            isActive(item.href)
                                                ? styles.mobileNavLinkActive
                                                : ''
                                        }`}
                                        onClick={closeMenu}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div ref={langRef} className={styles.mobileLang}>
                                    <span>KR</span>
                                    <span>EN</span>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
