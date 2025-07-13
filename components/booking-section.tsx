"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Mail, Music, DollarSign, CheckCircle } from "lucide-react"
import { useForm, ValidationError } from '@formspree/react'

export default function BookingSection() {
  const [state, handleSubmit] = useForm("mblynnle")

  return (
    <section id="book" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Work <span className="text-blue-400">With Me</span>
            </h2>

          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Music Production Lessons Column */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <Music className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Music Production Lessons</h3>
                <p className="text-gray-300 mb-4">One-on-one personalized music production instruction</p>

              </div>

              {/* Booking Card */}
              <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                  {/* Cal.com Embed */}
                  <div className="bg-[#0a0a0f] rounded-lg p-4 border border-blue-500/10">
                    <iframe
                      src="https://cal.com/derpcat/musicproductionlesson?embed=true&hide_event_type_details=1&background_color=0a0a0f&text_color=ffffff&primary_color=3b82f6"
                      width="100%"
                      height="400"
                      style={{ border: "none", borderRadius: "8px" }}
                      title="Cal.com scheduling for Derpcat"
                    />
                  </div>

                  {/* Book Button */}
                  <div className="text-center">
                    <Button
                      asChild
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <a
                        href="https://cal.com/derpcat/musicproductionlesson?overlayCalendar=true"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book on Cal.com
                      </a>
                    </Button>
                  </div>

                  {/* Lesson Details */}
                  <div className="space-y-4 pt-4 border-t border-blue-500/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Duration</h4>
                        <p className="text-gray-300 text-sm">60 minutes per session</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Availability</h4>
                        <p className="text-gray-300 text-sm">Real-time scheduling via Cal.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Get in Touch Column */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
                <p className="text-gray-300 mb-4">Professional music production services</p>

              </div>

              {/* Contact Card */}
              <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  {state.succeeded ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-300">Thanks for reaching out! I'll get back to you soon.</p>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="prod-name" className="block text-sm font-medium text-white mb-2">
                            Name
                          </label>
                          <Input
                            id="prod-name"
                            name="name"
                            placeholder="Your name"
                            className="bg-[#0a0a0f] border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
                          />
                          <ValidationError 
                            prefix="Name" 
                            field="name"
                            errors={state.errors}
                            className="text-red-400 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="prod-email" className="block text-sm font-medium text-white mb-2">
                            Email
                          </label>
                          <Input
                            id="prod-email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            className="bg-[#0a0a0f] border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
                          />
                          <ValidationError 
                            prefix="Email" 
                            field="email"
                            errors={state.errors}
                            className="text-red-400 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="prod-message" className="block text-sm font-medium text-white mb-2">
                          Project Details
                        </label>
                        <Textarea
                          id="prod-message"
                          name="message"
                          placeholder="Tell me about your track... What's your vision? Do you have vocals recorded? What services do you need?"
                          rows={6}
                          className="bg-[#0a0a0f] border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 resize-none rounded-lg"
                        />
                        <ValidationError 
                          prefix="Message" 
                          field="message"
                          errors={state.errors}
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                      >
                        {state.submitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}

                  {/* Services Info */}
                  <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Music className="w-4 h-4 mr-2 text-blue-400" />
                      Services Available
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Composition & arrangement
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Mixing & mastering
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Vocal recording & editing
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Sound design & effects
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Ghost production
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}