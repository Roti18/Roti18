export const profile = {
    name: {
        first: "ZAMRONI",
        last: "FAHREZA",
        full: "M. Zamroni Fahreza",
    },
    role: "Web Dev + SysSec",
    enthusiast: "Web Dev + SysSec",
    headline: {
        prefix: "Crafting",
        highlights: ["secure", "scalable"],
        suffix: "web systems with bulletproof architecture.",
    },
    logo: "ZF.",
    email: "contact@zamronifahreza.dev",
} as const;

export type Profile = typeof profile;
