"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// ═══════════════════════════════════════════════════════════════════
// GSAP ANIMATION SYSTEM - CORE
// ═══════════════════════════════════════════════════════════════════

// Register plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// ═══════════════════════════════════════════════════════════════════
// DEVICE DETECTION
// ═══════════════════════════════════════════════════════════════════
export const isDesktop = (): boolean => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024 && !("ontouchstart" in window);
};

export const isMobile = (): boolean => !isDesktop();

// ═══════════════════════════════════════════════════════════════════
// ANIMATION CONFIG
// ═══════════════════════════════════════════════════════════════════
export const ANIM = {
    // Easing - Cinematic feel
    ease: {
        smooth: "power3.out",
        smoothInOut: "power3.inOut",
        expo: "expo.out",
        expoInOut: "expo.inOut",
    },
    // Durations
    duration: {
        fast: 0.4,
        normal: 0.8,
        slow: 1.2,
        intro: 2.0,
    },
    // Stagger
    stagger: {
        fast: 0.03,
        normal: 0.06,
        slow: 0.1,
    },
} as const;

// ═══════════════════════════════════════════════════════════════════
// SECTION IDS
// ═══════════════════════════════════════════════════════════════════
export const SECTIONS = [
    "hero",
    "expertise",
    "selected-systems",
    "stack",
    "about",
    "contact",
] as const;

export type SectionId = (typeof SECTIONS)[number];

// ═══════════════════════════════════════════════════════════════════
// SCROLL STATE MANAGER
// ═══════════════════════════════════════════════════════════════════
class ScrollStateManager {
    private currentSection: SectionId = "hero";
    private listeners = new Set<(section: SectionId) => void>();
    private isLocked = false;

    setSection(section: SectionId) {
        if (this.currentSection !== section) {
            this.currentSection = section;
            this.listeners.forEach((fn) => fn(section));
        }
    }

    getSection(): SectionId {
        return this.currentSection;
    }

    subscribe(fn: (section: SectionId) => void) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    // Scroll lock for intro
    lock() {
        if (typeof document === "undefined") return;
        this.isLocked = true;
        document.body.style.overflow = "hidden";
        document.body.style.height = "100vh";
    }

    unlock() {
        if (typeof document === "undefined") return;
        this.isLocked = false;
        document.body.style.overflow = "";
        document.body.style.height = "";
    }

    isScrollLocked(): boolean {
        return this.isLocked;
    }
}

export const scrollState =
    typeof window !== "undefined"
        ? new ScrollStateManager()
        : ({} as ScrollStateManager);

// ═══════════════════════════════════════════════════════════════════
// SECTION REGISTRATION (for scroll-spy)
// ═══════════════════════════════════════════════════════════════════
export function registerSection(id: SectionId, el: Element): ScrollTrigger | null {
    if (isMobile()) return null; // No scroll-spy on mobile

    return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => scrollState.setSection(id),
        onEnterBack: () => scrollState.setSection(id),
    });
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL TO SECTION
// ═══════════════════════════════════════════════════════════════════
export function scrollToSection(id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;

    gsap.to(window, {
        scrollTo: { y: el, offsetY: 0 },
        duration: ANIM.duration.slow,
        ease: ANIM.ease.expoInOut,
    });
}

// ═══════════════════════════════════════════════════════════════════
// INTRO STATE (runs once)
// ═══════════════════════════════════════════════════════════════════
let introCompleted = false;

export function hasIntroPlayed(): boolean {
    return introCompleted;
}

export function markIntroComplete() {
    introCompleted = true;
}

// ═══════════════════════════════════════════════════════════════════
// CURSOR STATE
// ═══════════════════════════════════════════════════════════════════
export type CursorState = "default" | "hover" | "link" | "project";

class CursorStateManager {
    private state: CursorState = "default";
    private listeners = new Set<(state: CursorState) => void>();

    setState(state: CursorState) {
        if (this.state !== state) {
            this.state = state;
            this.listeners.forEach((fn) => fn(state));
        }
    }

    getState(): CursorState {
        return this.state;
    }

    subscribe(fn: (state: CursorState) => void) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }
}

export const cursorState =
    typeof window !== "undefined"
        ? new CursorStateManager()
        : ({} as CursorStateManager);

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════
export { gsap, ScrollTrigger, ScrollToPlugin };
