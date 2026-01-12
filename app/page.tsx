"use client";

import { useState } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ExpertiseSection from "@/components/ExpertiseSection";
import ProjectsPreview from "@/components/ProjectsPreview";
import StackSection from "@/components/StackSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

/**
 * Home Page - Animation System Controller
 *
 * This page orchestrates the entire animation system:
 * 1. IntroAnimation runs first (with scroll lock)
 * 2. Once complete, triggers navbar + hero entrance
 * 3. Custom cursor (desktop only)
 * 4. Smooth scroll (desktop only)
 * 5. Each section has its own scrubbed timeline
 */
export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {/* Global: Smooth scrolling (desktop only) */}
      <SmoothScroll />

      {/* Global: Custom cursor (desktop only) */}
      <CustomCursor introComplete={introComplete} />

      {/* Page load: Intro animation */}
      <IntroAnimation onComplete={() => setIntroComplete(true)} />

      {/* Navigation: Animates in after intro */}
      <Navbar introComplete={introComplete} />

      {/* Main content */}
      <Hero introComplete={introComplete} />
      <ExpertiseSection />
      <ProjectsPreview />
      <StackSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
