export interface AboutContent {
    segments: AboutSegment[];
}

export type AboutSegment =
    | { type: "text"; content: string }
    | { type: "bold"; content: string }
    | { type: "dim"; content: string };

export const about: AboutContent = {
    segments: [
        { type: "text", content: "Engineering rooted in " },
        { type: "bold", content: "clarity" },
        { type: "text", content: " and " },
        { type: "bold", content: "predictability" },
        { type: "text", content: ". " },
        {
            type: "dim",
            content: "I prioritize stable, long-term solutions over fleeting trends.",
        },
        { type: "text", content: " Bridging the gap between " },
        { type: "bold", content: "complex backend logic" },
        { type: "text", content: " and " },
        { type: "bold", content: "intuitive systems" },
        { type: "text", content: "." },
    ],
};
