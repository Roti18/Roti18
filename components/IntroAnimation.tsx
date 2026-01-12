"use client";

import { useLayoutEffect, useState } from "react";
import { gsap, ANIM, markIntroComplete, isDesktop } from "@/lib/gsap";

/**
 * IntroAnimation - Disabled on mobile
 */
interface IntroAnimationProps {
    onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useLayoutEffect(() => {
        // Mobile: Skip intro for performance/UX
        if (!isDesktop()) {
            markIntroComplete();
            setIsVisible(false);
            onComplete();
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    markIntroComplete();
                    setIsVisible(false);
                    onComplete();
                }
            });

            // Initial lock
            document.body.style.overflow = "hidden";

            // Sequence
            tl.set(".intro-text", { y: 20, opacity: 0 })
                .set(".intro-curtain", { y: "100%" }) // Curtain ready at bottom

                .to(".intro-text", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power4.out",
                    delay: 0.2
                })
                .to(".intro-text", {
                    y: -20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power4.in",
                    delay: 0.8
                })
                // The "Solid Closing" - Black curtain wipes UP to cover EVERYTHING
                .to(".intro-curtain", {
                    y: "0%",
                    duration: 0.8,
                    ease: "expo.inOut"
                })
                // Now we hide the white overlay behind the black curtain
                .set(".intro-overlay", { background: "transparent" })
                // Reveal Phase - Dark curtain slides up to show the site
                .to(".intro-curtain", {
                    y: "-100%",
                    duration: 1.2,
                    ease: "expo.inOut",
                    delay: 0.2,
                    onStart: () => {
                        document.body.style.overflow = "";
                    }
                });
        });

        return () => ctx.revert();
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className="intro-wrapper" style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none"
        }}>
            {/* White BG with Black Text */}
            <div className="intro-overlay" style={{
                position: "absolute",
                inset: 0,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                pointerEvents: "auto"
            }}>
                <h1 className="intro-text" style={{
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                    fontWeight: "950",
                    letterSpacing: "-0.04em",
                    color: "#000000",
                    margin: 0,
                    textTransform: "uppercase"
                }}>
                    M. ZAMRONI FAHREZA
                </h1>
            </div>

            {/* Solid Dark Curtain Reveal */}
            <div className="intro-curtain" style={{
                position: "absolute",
                inset: 0,
                background: "#000000",
                zIndex: 10,
                pointerEvents: "auto"
            }} />
        </div>
    );
}
