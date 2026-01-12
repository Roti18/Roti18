"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { gsap, ANIM, registerSection, isDesktop } from "@/lib/gsap";
import { projects } from "@/data";

/**
 * ProjectsPreview - With Modal, GSAP disabled on mobile
 */
interface ModalState {
    isOpen: boolean;
    project: typeof projects[0] | null;
}

export default function ProjectsPreview() {
    const containerRef = useRef<HTMLElement>(null);
    const [modal, setModal] = useState<ModalState>({ isOpen: false, project: null });

    const openModal = (project: typeof projects[0]) => {
        setModal({ isOpen: true, project });
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setModal({ isOpen: false, project: null });
        document.body.style.overflow = "";
    };

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Mobile: Just show content
        if (!isDesktop()) {
            gsap.set(containerRef.current, { autoAlpha: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            registerSection("selected-systems", containerRef.current!);
            gsap.set(containerRef.current, { autoAlpha: 1 });

            // Entrance
            gsap.from([".big-label", "h2", ".project-card-new"], {
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

            // Magnetic Interaction
            const cards = document.querySelectorAll(".project-card-new");
            cards.forEach((card) => {
                const inner = card.querySelector(".project-image-wrapper");

                card.addEventListener("mousemove", (e: any) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(card, {
                        x: x * 0.1,
                        y: y * 0.1,
                        duration: 0.4,
                        ease: "power2.out"
                    });

                    if (inner) {
                        gsap.to(inner, {
                            x: x * 0.05,
                            y: y * 0.05,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to([card, inner], {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.3)"
                    });
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <section id="selected-systems" ref={containerRef} style={{ opacity: isDesktop() ? 0 : 1 }}>
                <span className="big-label">02 // Systems</span>
                <h2>SELECTED SYSTEMS</h2>

                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card-new"
                            onClick={() => openModal(project)}
                        >
                            <div className="project-image-wrapper">
                                <div
                                    className="project-image"
                                    style={{ background: project.gradient }}
                                />
                            </div>

                            <div className="project-info">
                                <span className="project-num">{project.num}.</span>
                                <h3 className="project-title">
                                    {project.title[0]} {project.title[1]}
                                </h3>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.slice(0, 3).map((t) => (
                                        <span key={t} className="tech-tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal */}
            {modal.isOpen && modal.project && (
                <div className="project-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>

                        <div className="modal-image">
                            <div
                                className="modal-image-inner"
                                style={{ background: modal.project.gradient }}
                            />
                        </div>

                        <div className="modal-info">
                            <span className="project-num">{modal.project.num}.</span>
                            <h2>{modal.project.title[0]} {modal.project.title[1]}</h2>
                            <p>{modal.project.description}</p>
                            <div className="project-tech">
                                {modal.project.tech.map((t) => (
                                    <span key={t} className="tech-tag">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
