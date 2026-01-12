"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap, ANIM, registerSection, isDesktop } from "@/lib/gsap";
import { expertise } from "@/data";

/**
 * ExpertiseSection - GSAP disabled on mobile
 */
export default function ExpertiseSection() {
    const containerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Mobile: Just show content
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            registerSection("expertise", containerRef.current!);
            gsap.set(containerRef.current, { autoAlpha: 1 });

            gsap.from([".big-label", ".expertise-item"], {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: ANIM.ease.smooth,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="expertise" ref={containerRef} style={{ opacity: isDesktop() ? 0 : 1 }}>
            <span className="big-label">01 // Expertise</span>
            <div className="expertise-typo">
                {expertise.map((item) => (
                    <div key={item.id} className="expertise-item">
                        <span className="expertise-num">{item.id}.</span>
                        <div className="expertise-content">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
