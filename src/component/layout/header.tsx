'use client';

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import styles from "./header.module.css";

const NAV_ITEMS = [
    {label: 'ABOUT', href: '/about'},
    {label: 'PRODUCTS', href: '/products'},
    {label: 'BOARD', href: '/board'},
    {label: 'CONTACT', href: '/contact'},
] as const;

const TABLET_BREAKPOINT = 1024;

export default function Header() {
    const pathname = usePathname();
    const headerRef = useRef<HTMLElement>(null);
    const [isCompact, setIsCompact] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

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
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen && isCompact ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen, isCompact]);

    useEffect(() => {
        closeMenu();
    }, [pathname]);

    useEffect(() => {
        if (!isMenuOpen || !isCompact) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (headerRef.current && !headerRef.current.contains(target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };
    }, [isMenuOpen, isCompact]);

    return (
        <header ref={headerRef} className={styles.header}>
            <Link href="/" onClick={closeMenu}>
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
                <button type="button" className={styles.langCompact} aria-label="언어 선택">
                    EN
                </button>
                <button
                    type="button"
                    className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ""}`}
                    aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <span/>
                    <span/>
                    <span/>
                </button>
            </div>

            {isCompact && isMenuOpen && (
                <nav className={styles.mobileMenu} aria-label="모바일 메뉴">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobileNavLink} ${
                                isActive(item.href) ? styles.navLinkActive : ''
                            }`}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className={styles.mobileLang}>
                        <span>KR</span>
                        <span>EN</span>
                    </div>
                </nav>
            )}
        </header>
    );
}
