export interface SocialLink {
    name: string;
    url: string;
    icon?: string;
}

export interface FooterData {
    copyright: string;
    year: number;
    socials: SocialLink[];
    externalAssets: {
        resume?: string;
        github?: string;
    };
}

export const footer: FooterData = {
    copyright: "M. Zamroni Fahreza",
    year: 2026,
    socials: [
        {
            name: "GitHub",
            url: "https://github.com/zamronifahreza",
        },
        {
            name: "LinkedIn",
            url: "https://linkedin.com/in/zamronifahreza",
        },
        {
            name: "Twitter",
            url: "https://twitter.com/zamronifahreza",
        },
    ],
    externalAssets: {
        resume: "https://zamronifahreza.dev/resume.pdf",
        github: "https://github.com/zamronifahreza",
    },
};
