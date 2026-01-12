"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap, ANIM, registerSection, isDesktop } from "@/lib/gsap";
import { about } from "@/data";

/**
 * AboutSection - GSAP disabled on mobile
 */
export default function AboutSection() {
    const containerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Mobile: Just show content
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            registerSection("about", containerRef.current!);
            gsap.set(containerRef.current, { autoAlpha: 1 });

            gsap.from([".big-label", ".about-typo"], {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: ANIM.ease.smooth,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} style={{ opacity: isDesktop() ? 0 : 1 }}>
            <span className="big-label">04 // Mindset</span>
            <div className="about-typo">
                {about.segments.map((segment, i) => {
                    if (segment.type === "bold") {
                        return <b key={i}>{segment.content}</b>;
                    } else if (segment.type === "dim") {
                        return <span key={i} className="dim">{segment.content}</span>;
                    }
                    return segment.content;
                })}
            </div>
        </section>
    );
}
