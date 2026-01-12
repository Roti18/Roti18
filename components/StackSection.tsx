"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap, ANIM, registerSection, isDesktop } from "@/lib/gsap";
import { stack } from "@/data";

/**
 * StackSection - GSAP disabled on mobile
 */
export default function StackSection() {
    const containerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Mobile: Just show content
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            registerSection("stack", containerRef.current!);
            gsap.set(containerRef.current, { autoAlpha: 1 });

            gsap.from([".big-label", ".stack-item"], {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.03,
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
        <section id="stack" ref={containerRef} style={{ opacity: isDesktop() ? 0 : 1 }}>
            <span className="big-label">03 // Stack</span>
            <div className="stack-cloud">
                {stack.map((item) => (
                    <div key={item.name} className="stack-item">
                        {item.name}
                    </div>
                ))}
            </div>
        </section>
    );
}
