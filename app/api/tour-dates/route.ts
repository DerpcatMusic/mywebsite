// ARTIST-LANDING/app/api/tour-dates/route.ts

import { NextResponse } from "next/server";

// Read environment variables for the artist name and the Bandsintown app ID
const BANDSINTOWN_ARTIST_NAME = process.env.BANDSINTOWN_ARTIST_NAME;
const BANDSINTOWN_APP_ID = process.env.BANDSINTOWN_APP_ID;

export const runtime = "edge"; // <--- ADD THIS LINE HERE!

// Define the structure of an event object as returned by Bandsintown's API
interface BandsintownEvent {
  id: string;
  datetime: string; // e.g., "2024-02-15T20:00:00"
  venue: {
    name: string;
    city: string;
    region: string; // Often corresponds to 'state' in US/Canada
    country: string;
  };
  offers: Array<{
    type: string; // e.g., "Tickets", "Presale", "VIP"
    status: string; // e.g., "available", "sold out"
    url: string; // The URL for buying tickets
  }>;
  // Bandsintown API may return other fields, but we only need these for our display.
}

// Define the simplified structure that our React component expects
interface TourDate {
  id: string;
  date: string; // YYYY-MM-DD
  venue: string;
  city: string;
  state: string;
  time: string; // e.g., "8:00 PM"
  ticketLink: string;
  soldOut?: boolean;
}

// Handler for GET requests to this API route
export async function GET() {
  // 1. Validate that necessary environment variables are set
  if (!BANDSINTOWN_ARTIST_NAME || !BANDSINTOWN_APP_ID) {
    return NextResponse.json(
      { error: "Server configuration error: Artist name or App ID missing." },
      { status: 500 }
    );
  }

  // 2. Encode the artist name for URL safely
  const artistEncoded = encodeURIComponent(BANDSINTOWN_ARTIST_NAME);
  // Construct the Bandsintown API URL using the encoded artist name and the provided app ID
  const bandsintownApiUrl = `https://rest.bandsintown.com/artists/${artistEncoded}/events?app_id=${BANDSINTOWN_APP_ID}`;

  try {
    // 3. Fetch data from Bandsintown's API
    const response = await fetch(bandsintownApiUrl);

    // 4. Handle non-successful responses from Bandsintown's API (e.g., 403 Forbidden, 404 Not Found)
    if (!response.ok) {
      // Attempt to parse error details from Bandsintown's response body
      const errorDetails = await response.json().catch(() => ({})); // Parse JSON, but don't fail if not JSON

      return NextResponse.json(
        {
          error: `Failed to fetch events from Bandsintown: ${errorDetails.error || response.statusText}`,
        },
        { status: response.status }
      );
    }

    // 5. Parse the successful JSON response from Bandsintown
    const events: BandsintownEvent[] = await response.json();

    // 6. Transform and filter Bandsintown data into our desired `TourDate` format
    const tourDates: TourDate[] = events
      .filter(event => new Date(event.datetime).getTime() > Date.now()) // Filter out events that have already passed
      .map(event => {
        const dateObj = new Date(event.datetime);

        let ticketLink = "#"; // Default link
        let soldOut = false; // Default sold out status

        // --- NEW LOGIC FOR TICKET LINK AND SOLD OUT STATUS ---
        // Prioritize finding an offer specifically for "Tickets" with a valid URL
        const primaryTicketOffer = event.offers.find(
          offer => offer.type === "Tickets" && offer.url
        );

        if (primaryTicketOffer) {
          ticketLink = primaryTicketOffer.url;
          soldOut = primaryTicketOffer.status === "sold out";
        } else if (event.offers.length > 0) {
          // If no specific 'Tickets' type was found, try to find ANY offer with a valid URL
          // This catches cases where the offer type might be "Presale" or general link
          const anyValidOffer = event.offers.find(offer => offer.url);
          if (anyValidOffer) {
            ticketLink = anyValidOffer.url;
            soldOut = anyValidOffer.status === "sold out"; // Use status from this general offer
          }
        }
        // --- END NEW LOGIC ---

        return {
          id: event.id,
          date: dateObj.toISOString().split("T")[0], // Formats date to "YYYY-MM-DD"
          venue: event.venue.name,
          city: event.venue.city,
          state: event.venue.region, // Bandsintown's 'region' usually maps to 'state'
          time: dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }), // Formats time to "8:00 PM"
          ticketLink: ticketLink, // Use the determined ticketLink
          soldOut: soldOut, // Use the determined soldOut status
        };
      });

    // 7. Send the formatted and filtered tour dates back to the client-side component
    return NextResponse.json(tourDates);
  } catch (_error) {
    // 8. Catch any network-level errors or unexpected issues during the fetch process

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
