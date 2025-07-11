// ARTIST-LANDING/app/components/about-tours-section.tsx

"use client" // This directive marks the component to be rendered on the client-side

// Import necessary UI components and icons
import { Card, CardContent } from "@/components/ui/card" // Assuming these are correctly set up via shadcn/ui
import { Button } from "@/components/ui/button"         // Assuming these are correctly set up via shadcn/ui
import { Calendar, MapPin, Clock, ExternalLink, RefreshCw, XCircle } from "lucide-react" // Icons from lucide-react
// Import React hooks for managing state and side effects
import { useState, useEffect } from "react"

// Define the interface for the tour date data, matching what your API route returns
interface TourDate {
  id: string
  date: string // YYYY-MM-DD
  venue: string
  city: string
  state: string
  time: string // e.g., "8:00 PM"
  ticketLink: string
  soldOut?: boolean // Optional property
}

// Helper function to format the date string for display
function formatDate(dateString: string) {
  if (!dateString) { // Handle cases where dateString might be empty or null
    return { month: 'N/A', day: 'N/A', weekday: 'N/A' };
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) { // Check if the date object is invalid (e.g., if dateString was "TEST")
    return { month: 'N/A', day: 'N/A', weekday: 'N/A' };
  }
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(), // e.g., "FEB"
    day: date.getDate(), // e.g., "15"
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(), // e.g., "THU"
  }
}

// The main React component
export default function AboutToursSection() {
  // State variables to manage the component's data and UI state
  const [tourDates, setTourDates] = useState<TourDate[]>([]); // Stores the fetched tour dates
  const [isLoading, setIsLoading] = useState(true);          // True while data is being fetched
  const [error, setError] = useState<string | null>(null);    // Stores any error messages

  // useEffect hook to perform data fetching when the component first loads
  useEffect(() => {
    const fetchTourDates = async () => {
      setIsLoading(true); // Set loading state to true
      setError(null);     // Clear any previous errors

      try {
        // Fetch data from your own Next.js API route (the middleman)
        // This is a relative path, so it correctly points to http://localhost:3000/api/tour-dates
        const response = await fetch('/api/tour-dates');

        // Check if the response from your API route was successful
        if (!response.ok) {
          const errorData = await response.json(); // Get the error message from your API route
          throw new Error(errorData.error || `Failed to fetch tour dates (Status: ${response.status})`);
        }

        // Parse the JSON data received from your API route
        const data: TourDate[] = await response.json();
        setTourDates(data); // Update the component's state with the fetched dates
      } catch (err: any) {
        // Catch and handle any errors that occur during the fetch operation
        setError(err.message || 'An unknown error occurred while fetching tour dates.');
        console.error("Client-side tour dates fetch error:", err);
      } finally {
        setIsLoading(false); // Set loading state to false, regardless of success or failure
      }
    };

    fetchTourDates(); // Call the fetch function when the component mounts
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  return (
    <section id="about" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* About Section - 2/3 width (This section remains unchanged from your original code) */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              About <span className="text-primary">Derpcat</span>
            </h2>

            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Born in 03', Been producing music since the age of 13. (u do the math)
              Got on various big labels such as NCS, Monstercat, Ophelia, Most Addictive and more.
              I write, compose and produce all sorts of music wether it's Electronic, Pop and even Orchestra.
              I got a big passion for Sound Design, Graphic Design, Software and many many more.
              </p>

              {/* <p className="text-lg text-gray-400 leading-relaxed">
                Been Studying Music Production for over 10 years, Primarily focused on composition, sound design and most importantly how to convey emotions through music.
              </p>

              <p className="text-lg text-gray-400 leading-relaxed">
                I believe that music is a universal language that can connect people from all walks of life, and I strive to create experiences that resonate on a deep emotional level.
              </p> 
              </p>*/}

              <div className="inline-block p-8 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 mt-12">
                <p className="text-lg text-gray-300 mb-4 italic">
                  "My name isn't typical but so is my music, and for that I always say: Expect the Unexpected"
              ."
                </p>
                <p className="text-primary font-semibold">- Your Artist</p>
              </div>
            </div>
          </div>

          {/* Tours Section - 1/3 width (This section dynamically displays tour dates) */}
          <div id="tours" className="lg:col-span-1">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Upcoming <span className="text-primary">Shows</span>
            </h3>

            {/* Conditional rendering based on the loading and error states */}
            {isLoading ? (
              // Display a loading indicator while data is being fetched
              <div className="text-center py-8">
                <RefreshCw className="w-12 h-12 text-primary/50 mx-auto mb-4 animate-spin" />
                <h4 className="text-lg font-semibold text-white mb-2">Loading Shows...</h4>
                <p className="text-gray-400 text-sm">Fetching latest tour dates.</p>
              </div>
            ) : error ? (
              // Display an error message if fetching failed
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-red-500/70 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-red-400 mb-2">Error Loading Shows</h4>
                <p className="text-gray-400 text-sm">{error}</p>
                <p className="text-gray-400 text-xs mt-2">Please ensure your artist name and app ID are correct in .env.local and check your server logs.</p>
              </div>
            ) : (
              // If data is loaded successfully and there are no errors, display the tour dates
              <div className="space-y-4">
                {tourDates.map((show) => { // Map over the dynamically fetched tourDates
                  const dateInfo = formatDate(show.date) // Format the date for display
                  return (
                    <Card
                      key={show.id} // Unique key for React list rendering
                      className="bg-card border-primary/20 hover:border-primary/40 transition-all duration-150 group"
                      style={{ borderRadius: "0px" }} // Maintain original styling
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Date and Venue Information */}
                          <div className="flex items-center space-x-4">
                            <div className="text-center min-w-[60px]">
                              <div className="text-primary font-bold text-sm">{dateInfo.month}</div>
                              <div className="text-white font-bold text-xl">{dateInfo.day}</div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-sm mb-1 truncate">{show.venue}</h4>
                              <div className="flex items-center text-gray-300 text-xs mb-1">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {show.city}, {show.state}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-300 text-xs">
                                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span>{show.time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Ticket Button or Sold Out message */}
                          <div className="w-full">
                            {show.soldOut ? (
                              // Display "Sold Out" if the show is marked as such
                              <div
                                className="w-full px-4 py-2 bg-gray-600 text-gray-300 text-center font-medium text-sm"
                                style={{ borderRadius: "0px" }}
                              >
                                Sold Out
                              </div>
                            ) : (
                              // Display "Get Tickets" button if not sold out
                              <Button
                                asChild // Renders as an <a> tag
                                className="w-full bg-primary hover:bg-transparent hover:border-2 hover:border-primary text-white font-medium px-4 py-2 text-sm transition-all duration-150 group"
                                style={{ borderRadius: "0px" }}
                              >
                                <a href={show.ticketLink} target="_blank" rel="noopener noreferrer">
                                  Get Tickets
                                  <ExternalLink className="w-3 h-3 ml-2 transition-transform duration-150" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Display message if no shows are scheduled after loading completes and no errors */}
            {!isLoading && !error && tourDates.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">No Shows Scheduled</h4>
                <p className="text-gray-400 text-sm">Check back soon for upcoming tour dates!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}