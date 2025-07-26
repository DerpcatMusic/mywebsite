// ARTIST-LANDING/app/components/about-tours-section.tsx

"use client"; // This directive marks the component to be rendered on the client-side

// Import necessary UI components and icons
import { Button } from "@/components/ui/button"; // Assuming these are correctly set up via shadcn/ui
import { Card, CardContent } from "@/components/ui/card"; // Assuming these are correctly set up via shadcn/ui
import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react"; // Icons from lucide-react
// Import React hooks for managing state and side effects
import { useEffect, useState } from "react";

// Define the interface for the tour date data, matching what your API route returns
interface TourDate {
  id: string;
  date: string; // YYYY-MM-DD
  venue: string;
  city: string;
  state: string;
  time: string; // e.g., "8:00 PM"
  ticketLink: string;
  soldOut?: boolean; // Optional property
}

// Helper function to format the date string for display
function formatDate(dateString: string) {
  if (!dateString) {
    // Handle cases where dateString might be empty or null
    return { month: "N/A", day: "N/A", weekday: "N/A" };
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Check if the date object is invalid (e.g., if dateString was "TEST")
    return { month: "N/A", day: "N/A", weekday: "N/A" };
  }
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(), // e.g., "FEB"
    day: date.getDate(), // e.g., "15"
    weekday: date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(), // e.g., "THU"
  };
}

// The main React component
export default function AboutToursSection() {
  // State variables to manage the component's data and UI state
  const [tourDates, setTourDates] = useState<TourDate[]>([]); // Stores the fetched tour dates
  const [isLoading, setIsLoading] = useState(true); // True while data is being fetched
  const [error, setError] = useState<string | null>(null); // Stores any error messages

  // useEffect hook to perform data fetching when the component first loads
  useEffect(() => {
    const fetchTourDates = async () => {
      setIsLoading(true); // Set loading state to true
      setError(null); // Clear any previous errors

      try {
        // Fetch data from your own Next.js API route (the middleman)
        // This is a relative path, so it correctly points to http://localhost:3000/api/tour-dates
        const response = await fetch("/api/tour-dates");

        // Check if the response from your API route was successful
        if (!response.ok) {
          const errorData = await response.json(); // Get the error message from your API route
          throw new Error(
            errorData.error ||
              `Failed to fetch tour dates (Status: ${response.status})`
          );
        }

        // Parse the JSON data received from your API route
        const data: TourDate[] = await response.json();
        setTourDates(data); // Update the component's state with the fetched dates
      } catch (err: unknown) {
        // Catch and handle any errors that occur during the fetch operation
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching tour dates.";
        setError(errorMessage);
      } finally {
        setIsLoading(false); // Set loading state to false, regardless of success or failure
      }
    };

    fetchTourDates(); // Call the fetch function when the component mounts
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  return (
    <section id="about" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* About Section - 2/3 width (This section remains unchanged from your original code) */}
          <div className="lg:col-span-2">
            <h2 className="mb-8 text-4xl font-bold text-foreground md:text-5xl">
              About <span className="text-primary">Derpcat</span>
            </h2>

            <div className="space-y-8">
              <p className="text-xl leading-relaxed text-muted-foreground md:text-2xl">
                Born in 03', Been producing music since the age of 13. (u do the
                math) Got on various big labels such as NCS, Monstercat,
                Ophelia, Most Addictive and more. I write, compose and produce
                all sorts of music wether it's Electronic, Pop and even
                Orchestra. I got a big passion for Sound Design, Graphic Design,
                Software and many many more.
              </p>

              {/* <p className="text-lg text-gray-400 leading-relaxed">
                Been Studying Music Production for over 10 years, Primarily focused on composition, sound design and most importantly how to convey emotions through music.
              </p>

              <p className="text-lg text-gray-400 leading-relaxed">
                I believe that music is a universal language that can connect people from all walks of life, and I strive to create experiences that resonate on a deep emotional level.
              </p>
              </p>*/}

              <div className="mt-12 inline-block border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-8">
                <p className="mb-4 text-lg italic text-muted-foreground">
                  "My name isn't typical but so is my music, and for that I
                  always say: Expect the Unexpected"
                </p>
                <p className="font-semibold text-primary">- Derpcat</p>
              </div>
            </div>
          </div>

          {/* Tours Section - 1/3 width (This section dynamically displays tour dates) */}
          <div id="tours" className="flex flex-col justify-end lg:col-span-1">
            <h3 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
              Upcoming <span className="text-primary">Shows</span>
            </h3>

            {/* Conditional rendering based on the loading and error states */}
            {isLoading ? (
              // Display a loading indicator while data is being fetched
              <div className="flex-grow py-8 text-center">
                <RefreshCw className="mx-auto mb-4 h-12 w-12 animate-spin text-primary/50" />
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  Loading Shows...
                </h4>
                <p className="text-sm text-muted-foreground">
                  Fetching latest tour dates.
                </p>
              </div>
            ) : error ? (
              // Display an error message if fetching failed
              <div className="flex-grow py-8 text-center">
                <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500/70" />
                <h4 className="mb-2 text-lg font-semibold text-destructive">
                  Error Loading Shows
                </h4>
                <p className="text-sm text-muted-foreground">{error}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Please ensure your artist name and app ID are correct in
                  .env.local and check your server logs.
                </p>
              </div>
            ) : (
              // If data is loaded successfully and there are no errors, display the tour dates
              <div className="flex-grow space-y-4">
                {tourDates.map(show => {
                  // Map over the dynamically fetched tourDates
                  const dateInfo = formatDate(show.date); // Format the date for display
                  return (
                    <Card
                      key={show.id} // Unique key for React list rendering
                      className="group border-primary/20 bg-card transition-all duration-150 hover:border-primary/40"
                      style={{ borderRadius: "0px" }} // Maintain original styling
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Date and Venue Information */}
                          <div className="flex items-center space-x-4">
                            <div className="min-w-[60px] text-center">
                              <div className="text-sm font-bold text-primary">
                                {dateInfo.month}
                              </div>
                              <div className="text-xl font-bold text-white">
                                {dateInfo.day}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="mb-1 truncate text-sm font-semibold text-foreground">
                                {show.venue}
                              </h4>
                              <div className="mb-1 flex items-center text-xs text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {show.city}, {show.state}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                                <span>{show.time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Ticket Button or Sold Out message */}
                          <div className="w-full">
                            {show.soldOut ? (
                              // Display "Sold Out" if the show is marked as such
                              <div
                                className="w-full bg-muted px-4 py-2 text-center text-sm font-bold text-muted-foreground"
                                style={{ borderRadius: "0px" }}
                              >
                                Sold Out
                              </div>
                            ) : (
                              // Display "Get Tickets" button if not sold out
                              <Button
                                asChild // Renders as an <a> tag
                                className="group w-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all duration-150 hover:border-2 hover:border-primary hover:bg-transparent"
                                style={{ borderRadius: "0px" }}
                              >
                                <a
                                  href={show.ticketLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Get Tickets
                                  <ExternalLink className="ml-2 h-3 w-3 transition-transform duration-150" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Display message if no shows are scheduled after loading completes and no errors */}
            {!isLoading && !error && tourDates.length === 0 && (
              <div className="flex-grow py-8 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-primary/50" />
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  No Shows Scheduled
                </h4>
                <p className="text-sm text-muted-foreground">
                  Check back soon for upcoming tour dates!
                </p>
              </div>
            )}

            {/* Bandsintown Buttons */}
            <div className="flex flex-row space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
              <Button
                asChild
                className="w-full bg-primary px-4 py-2 text-base font-bold text-primary-foreground transition-all duration-150 hover:bg-primary/90"
              >
                <a
                  href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow Me on Bandsintown
                </a>
              </Button>
              <Button
                asChild
                className="w-full bg-primary px-4 py-2 text-base font-bold text-primary-foreground transition-all duration-150 hover:bg-primary/90"
              >
                <a
                  href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat?affil_code=js_&app_id=js_&bg-color=rgba%28255%2C255%2C255%2C1%29&border-color=rgba%2874%2C74%2C74%2C1%29&came_from=700&cta-bg-color=rgba%2874%2C74%2C74%2C1%29&cta-border-color=rgba%2874%2C74%2C74%2C1%29&cta-border-radius=2px&cta-border-width=0px&cta-text-color=rgba%28255%2C255%2C255%2C1%29&font=Helvetica&play-my-city=true&signature=ZZ7a6c5a954bfa5ccf256789d33d35925c0a4085d514f28cc54384a917b1c25a73&spn=0&text-color=rgba%2866%2C66%2C66%2C1%29&utm_campaign=play_my_city&utm_medium=web&utm_source=widget"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Request a Show
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
