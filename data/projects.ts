export interface Project {
    id: string;
    num: string;
    title: string[];
    status: "live" | "development" | "archived";
    description: string;
    tech: string[];
    image: string;
    gradient: string;
}

export const projects: Project[] = [
    {
        id: "nexus-engine",
        num: "01",
        title: ["Nexus", "Engine"],
        status: "live",
        description:
            "High-performance API gateway with intelligent load balancing and real-time analytics dashboard.",
        tech: ["TypeScript", "Go", "Redis", "Docker"],
        image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        gradient: "linear-gradient(135deg, #1e1e1e, #000)",
    },
    {
        id: "aether-core",
        num: "02",
        title: ["Aether", "Core"],
        status: "live",
        description:
            "Distributed authentication system with zero-trust architecture and hardware key support.",
        tech: ["Rust", "WebAssembly", "PostgreSQL", "K8s"],
        image:
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        gradient: "radial-gradient(circle, #222, #000)",
    },
    {
        id: "cipher-vault",
        num: "03",
        title: ["Cipher", "Vault"],
        status: "development",
        description:
            "End-to-end encrypted secrets manager with biometric authentication and audit logging.",
        tech: ["Rust", "React", "SQLite", "WebCrypto"],
        image:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        gradient: "linear-gradient(225deg, #0a0a0a, #1a1a2e)",
    },
];
