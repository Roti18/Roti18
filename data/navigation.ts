export interface NavLink {
    label: string;
    href: string;
    isExternal?: boolean;
}

export const navigation: NavLink[] = [
    { label: "Expertise", href: "#expertise" },
    { label: "Stack", href: "#stack" },
    { label: "Projects", href: "#selected-systems" },
    { label: "Contact", href: "#contact" },
];
