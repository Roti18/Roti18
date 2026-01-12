"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap, ANIM, registerSection, isDesktop } from "@/lib/gsap";
import { profile } from "@/data";

/**
 * Hero - GSAP disabled on mobile
 */
interface HeroProps {
    introComplete: boolean;
}

export default function Hero({ introComplete }: HeroProps) {
    const containerRef = useRef<HTMLElement>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);
    const roleRef = useRef<HTMLHeadingElement>(null);
    const headlineRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Mobile: Just show content, no GSAP
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            registerSection("hero", containerRef.current!);
            gsap.set(containerRef.current, { autoAlpha: 0 });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        if (!introComplete || !containerRef.current) return;

        // Mobile: Just show, no animations
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.set(containerRef.current, { autoAlpha: 1 });

            const tl = gsap.timeline({ defaults: { ease: ANIM.ease.expo } });

            tl.from(nameRef.current, {
                y: 60,
                opacity: 0,
                duration: 1.2,
            }, 0);

            tl.from(roleRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
            }, 0.3);

            tl.from(headlineRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
            }, 0.5);

        }, containerRef);

        return () => ctx.revert();
    }, [introComplete]);

    return (
        <main id="hero" ref={containerRef} className="hero" style={{ opacity: isDesktop() ? 0 : 1 }}>
            <h1 ref={nameRef}>
                {profile.name.first}
                <br />
                {profile.name.last}
            </h1>
            <div className="hero-meta">
                <h2 ref={roleRef}>{profile.enthusiast}</h2>
                <p ref={headlineRef} className="positioning">
                    {profile.headline.prefix}{" "}
                    {profile.headline.highlights.map((h, i) => (
                        <b key={i}>{h} </b>
                    ))}
                    {profile.headline.suffix}
                </p>
            </div>
        </main>
    );
}
