// lib/patreon.ts

export interface PatreonTier {
    id: string;
    type: 'tier';
    attributes: {
      title: string;
      description: string;
      amount_cents: number;
      image_url: string | null;
      url: string;
    };
  }
  
  // Helper functions for the product card
  export function getPatreonTierImage(tier: PatreonTier): string | null {
    return tier.attributes.image_url;
  }
  
  export function getPatreonTierPrice(tier: PatreonTier): string {
    const price = (tier.attributes.amount_cents / 100).toFixed(2);
    return `$${price}/mo`;
  }
  
  export function getPatreonTierDescription(tier: PatreonTier): string {
    return tier.attributes.description;
  }
  
  export function getPatreonTierUrl(tier: PatreonTier): string {
    // We will link to the main creator page from the cards
    return process.env.NEXT_PUBLIC_PATREON_CREATOR_URL || 'https://www.patreon.com';
  }
  
  // Main server-side function to fetch all tiers
  export async function getAllPatreonTiers(): Promise<PatreonTier[]> {
    const campaignId = process.env.PATREON_CAMPAIGN_ID;
    const accessToken = process.env.PATREON_CREATOR_ACCESS_TOKEN;
  
    if (!campaignId || !accessToken) {
      console.warn("Patreon environment variables are missing. Skipping Patreon fetch.");
      return [];
    }
  
    try {
      const response = await fetch(
        `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}?include=tiers&fields[tier]=title,description,amount_cents,image_url,url`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          // Revalidate data periodically to keep it fresh
          next: { revalidate: 3600 }, // Re-fetch every hour
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Patreon API Error:", response.status, errorData);
        throw new Error(`Patreon API call failed with status ${response.status}`);
      }
  
      const data = await response.json();
      const tiers = data.included?.filter((item: any) => item.type === 'tier') || [];
      return tiers as PatreonTier[];
    } catch (error) {
      console.error("Error in getAllPatreonTiers:", error);
      // Return empty array on error so the page doesn't crash
      return [];
    }
  }