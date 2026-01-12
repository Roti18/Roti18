"use client";

import { useEffect } from "react";

/**
 * CustomCursor - Bubble cursor with invert effect on hover
 * 
 * - Single bubble (no dot)
 * - Hover: bigger + mix-blend-mode: difference (negative effect)
 */
interface CustomCursorProps {
    introComplete: boolean;
}

export default function CustomCursor({ introComplete }: CustomCursorProps) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Check if mobile/tablet
        const isMobile = window.innerWidth < 1024 ||
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

        if (isMobile) return;

        // Create bubble cursor
        const bubble = document.createElement("div");
        bubble.id = "custom-cursor";

        // Label inside cursor for projects
        const label = document.createElement("span");
        label.className = "cursor-label";
        bubble.appendChild(label);

        Object.assign(bubble.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "20px",
            height: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: "99999",
            transform: "translate(-50%, -50%)",
            transition: "width 0.3s cubic-bezier(0.23, 1, 0.32, 1), height 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease",
            mixBlendMode: "difference",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            opacity: introComplete ? "1" : "0" // Hide during intro
        });

        Object.assign(label.style, {
            color: "black",
            fontSize: "10px",
            fontWeight: "900",
            letterSpacing: "0.1em",
            opacity: "0",
            transition: "opacity 0.2s ease"
        });

        document.body.appendChild(bubble);

        // Hide default cursor globally
        const styleEl = document.createElement("style");
        styleEl.id = "cursor-hide-style";
        styleEl.textContent = `
            *, *::before, *::after { cursor: none !important; }
        `;
        document.head.appendChild(styleEl);

        // Position state
        let mouseX = 0, mouseY = 0;
        let bubbleX = 0, bubbleY = 0;

        // Mouse move
        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dynamic Hover Check via Event Delegation
            const target = e.target as HTMLElement;
            const interactive = target.closest("a, button, .project-card-new, .stack-item, .expertise-item, h1, h2, h3, .contact-email");

            if (interactive) {
                bubble.style.width = "60px";
                bubble.style.height = "60px";

                if (interactive.classList.contains("project-card-new")) {
                    label.textContent = "VIEW";
                    label.style.opacity = "1";
                    bubble.style.width = "80px";
                    bubble.style.height = "80px";
                } else {
                    label.style.opacity = "0";
                }
            } else {
                bubble.style.width = "20px";
                bubble.style.height = "20px";
                label.style.opacity = "0";
            }
        };

        // Animation loop with lerp
        let animationId: number;
        const animate = () => {
            bubbleX += (mouseX - bubbleX) * 0.15;
            bubbleY += (mouseY - bubbleY) * 0.15;

            bubble.style.left = bubbleX + "px";
            bubble.style.top = bubbleY + "px";

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMouseMove);
        animationId = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationId);
            bubble.remove();
            styleEl.remove();
        };
    }, []);

    // Reactive visibility update
    useEffect(() => {
        const bubble = document.getElementById("custom-cursor");
        if (bubble) {
            bubble.style.opacity = introComplete ? "1" : "0";
        }
    }, [introComplete]);

    return null;
}
