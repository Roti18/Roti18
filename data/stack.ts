export interface StackItem {
    name: string;
    category: "language" | "framework" | "infra" | "database";
}

export const stack: StackItem[] = [
    { name: "TYPESCRIPT", category: "language" },
    { name: "RUST", category: "language" },
    { name: "GO", category: "language" },
    { name: "REACT", category: "framework" },
    { name: "WASM", category: "framework" },
    { name: "AWS", category: "infra" },
    { name: "DOCKER", category: "infra" },
    { name: "POSTGRES", category: "database" },
    { name: "K8S", category: "infra" },
];
