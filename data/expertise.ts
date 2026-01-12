export interface ExpertiseItem {
    id: string;
    title: string;
    description: string;
}

export const expertise: ExpertiseItem[] = [
    {
        id: "A",
        title: "ARCHITECTURE",
        description:
            "Designing modular systems that scale without accumulating technical debt.",
    },
    {
        id: "B",
        title: "PERFORMANCE",
        description:
            "Optimizing critical paths to reduce latency and infrastructure costs.",
    },
    {
        id: "C",
        title: "INTERFACES",
        description:
            "Developing robust component architectures for data-heavy applications.",
    },
];
