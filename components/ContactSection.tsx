"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap, ANIM, registerSection, isDesktop } from "@/lib/gsap";
import { profile } from "@/data";

/**
 * ContactSection - GSAP disabled on mobile
 */
export default function ContactSection() {
    const containerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Mobile: Just show content
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            registerSection("contact", containerRef.current!);
            gsap.set(containerRef.current, { autoAlpha: 1 });

            gsap.from([".big-label", "h2", ".contact-email"], {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: ANIM.ease.smooth,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" className="contact-typo" ref={containerRef} style={{ opacity: isDesktop() ? 0 : 1 }}>
            <span className="big-label">05 // Connect</span>
            <h2>LET&apos;S BUILD.</h2>
            <a href={`mailto:${profile.email}`} className="contact-email">
                {profile.email.toUpperCase()}
            </a>
        </section>
    );
}
