export interface UnifiedProduct {
    id: string;
    name: string;
    description: string;
    image: string | null;
    price: number;
    currency: string;
    formattedPrice: string;
    slug?: string;
    externalUrl?: string;
    isExternal: boolean;
    type: "fourthwall" | "gumroad" | "lemonsqueezy" | "patreon";
    available: boolean;
}
