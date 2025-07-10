"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"

interface TourDate {
  id: string
  date: string
  venue: string
  city: string
  state: string
  time: string
  ticketLink: string
  soldOut?: boolean
}

// Configure your tour dates here - easily manageable
const tourDates: TourDate[] = [
  {
    id: "1",
    date: "2024-02-15",
    venue: "The Fillmore",
    city: "San Francisco",
    state: "CA",
    time: "8:00 PM",
    ticketLink: "https://ticketmaster.com/your-show",
  },
  {
    id: "2",
    date: "2024-02-22",
    venue: "House of Blues",
    city: "Los Angeles",
    state: "CA",
    time: "9:00 PM",
    ticketLink: "https://ticketmaster.com/your-show-2",
  },
  {
    id: "3",
    date: "2024-03-01",
    venue: "Brooklyn Bowl",
    city: "Brooklyn",
    state: "NY",
    time: "7:30 PM",
    ticketLink: "https://ticketmaster.com/your-show-3",
    soldOut: true,
  },
  {
    id: "4",
    date: "2024-03-08",
    venue: "The Observatory",
    city: "Santa Ana",
    state: "CA",
    time: "8:30 PM",
    ticketLink: "https://ticketmaster.com/your-show-4",
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  }
}

export default function ToursSection() {
  return (
    <section id="tours" className="py-20 bg-gradient-to-br from-black to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Upcoming <span className="text-primary">Shows</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Catch me live at these upcoming performances. Get your tickets before they sell out!
            </p>
          </div>

          <div className="space-y-4">
            {tourDates.map((show) => {
              const dateInfo = formatDate(show.date)
              return (
                <Card
                  key={show.id}
                  className="bg-card border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Date */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center min-w-[80px]">
                          <div className="text-primary font-bold text-lg">{dateInfo.month}</div>
                          <div className="text-white font-bold text-2xl">{dateInfo.day}</div>
                          <div className="text-gray-400 text-sm">{dateInfo.weekday}</div>
                        </div>

                        {/* Venue Info */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1">{show.venue}</h3>
                          <div className="flex items-center text-gray-300 mb-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>
                              {show.city}, {show.state}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{show.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Button */}
                      <div className="flex-shrink-0">
                        {show.soldOut ? (
                          <div className="px-6 py-3 bg-gray-600 text-gray-300 rounded-full font-medium">Sold Out</div>
                        ) : (
                          <Button
                            asChild
                            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 group"
                          >
                            <a href={show.ticketLink} target="_blank" rel="noopener noreferrer">
                              Get Tickets
                              <ExternalLink className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
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

          {/* No shows message if empty */}
          {tourDates.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Shows Scheduled</h3>
              <p className="text-gray-400">Check back soon for upcoming tour dates!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
