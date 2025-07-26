// components/patreon-tiers-display.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAllPatreonTiers } from "@/lib/patreon";
import { AlertCircle } from "lucide-react";
import AltProductCard from "./alt-product-card";

// This is an async Server Component, it runs on the server.
export default async function PatreonTiersDisplay(): Promise<React.JSX.Element> {
  // The `getAllPatreonTiers` function is cached by Next.js
  const tiers = await getAllPatreonTiers();

  if (!tiers || tiers.length === 0) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Could Not Load Tiers</AlertTitle>
        <AlertDescription>
          There was an issue fetching the Patreon tiers. This might be a
          temporary problem or a configuration issue. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
      {tiers.map(tier => (
        // The AltProductCard is already built with shadcn/ui components
        <AltProductCard key={tier.id} product={tier} />
      ))}
    </div>
  );
}
