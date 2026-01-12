"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { isDesktop } from "@/lib/gsap";

/**
 * SmoothScroll - Desktop only
 */
export default function SmoothScroll() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Mobile: Skip smooth scroll, use native
        if (!isDesktop()) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
