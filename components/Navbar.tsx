"use client";

import { useRef, useLayoutEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    gsap,
    ANIM,
    scrollState,
    scrollToSection,
    isDesktop,
    type SectionId,
} from "@/lib/gsap";
import { profile, navigation } from "@/data";

/**
 * Navbar - Responsive with GSAP disabled on mobile
 */
interface NavbarProps {
    introComplete: boolean;
}

export default function Navbar({ introComplete }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const linkElementsRef = useRef<Map<string, HTMLAnchorElement>>(new Map());

    useLayoutEffect(() => {
        if (!navRef.current) return;

        // Mobile: No GSAP animations, just show nav
        if (!isDesktop()) {
            gsap.set(navRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.set(navRef.current, { autoAlpha: 0, y: -30 });
            gsap.set(indicatorRef.current, { scaleX: 0, opacity: 0 });
        }, navRef);

        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        if (!introComplete || !navRef.current) return;

        // Mobile: Just show, no animation
        if (!isDesktop()) {
            gsap.set(navRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            // Entrance
            gsap.to(navRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: ANIM.duration.normal,
                ease: ANIM.ease.expo,
            });

            const links = linksRef.current?.querySelectorAll("a");
            if (links) {
                gsap.from(links, {
                    x: 30,
                    opacity: 0,
                    duration: ANIM.duration.normal,
                    stagger: ANIM.stagger.normal,
                    ease: ANIM.ease.smooth,
                });
            }

            // Indicator Sync
            const updateIndicator = (activeId: string) => {
                const activeLink = linkElementsRef.current.get(`#${activeId}`);
                if (activeLink && indicatorRef.current) {
                    const linkRect = activeLink.getBoundingClientRect();
                    const navRect = linksRef.current?.getBoundingClientRect() || { top: 0 };

                    gsap.to(indicatorRef.current, {
                        y: linkRect.top - navRect.top + (linkRect.height / 2),
                        opacity: 1,
                        scaleX: 1,
                        duration: 0.6,
                        ease: "power3.out"
                    });
                }
            };

            // Subscribe to global scroll state
            const unsubscribe = scrollState.subscribe((id) => {
                updateIndicator(id);
            });

            // Initial position
            updateIndicator(scrollState.getSection());

            return unsubscribe;
        }, navRef);

        return () => ctx.revert();
    }, [introComplete]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const sectionId = href.slice(1) as SectionId;

            // On mobile, use native scroll
            if (!isDesktop()) {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
                return;
            }

            scrollToSection(sectionId);
        }
    };

    return (
        <nav ref={navRef}>
            <div className="nav-inner">
                <Link href="/" className="nav-logo">
                    {profile.logo}
                </Link>
                <div ref={linksRef} className="nav-links" style={{ position: "relative" }}>
                    <div
                        ref={indicatorRef}
                        className="nav-indicator"
                        style={{
                            position: "absolute",
                            right: "100%",
                            marginRight: "12px",
                            width: "24px",
                            height: "1px",
                            background: "white",
                            transformOrigin: "right center",
                        }}
                    />
                    {navigation.map((item) => (
                        <a
                            key={item.href}
                            ref={(el) => {
                                if (el) linkElementsRef.current.set(item.href, el);
                            }}
                            href={item.href}
                            onClick={(e) => handleClick(e, item.href)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}
