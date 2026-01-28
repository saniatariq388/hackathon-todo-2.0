'use client';

import { Calendar as CalendarIcon, Plus, Clock, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

export default function CalendarPage() {
  // Mock data for calendar events
  const events = [
    { id: 1, title: 'Team Meeting', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Project Deadline', time: '2:00 PM', date: 'Tomorrow' },
    { id: 3, title: 'Client Call', time: '4:30 PM', date: 'Jan 15' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
              <p className="text-muted-foreground">View and manage your schedule</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">January 2026</h2>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all btn-with-border">
                        &lt;
                      </button>
                      <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all btn-with-border">
                        &gt;
                      </button>
                    </div>
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty days for the start of the month */}
                    {[...Array(3)].map((_, i) => (
                      <div key={`empty-${i}`} className="h-24 border border-border rounded-lg"></div>
                    ))}
                    
                    {/* Days of the month */}
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const hasEvent = [12, 15, 18, 22].includes(day); // Mock event days
                      
                      return (
                        <div 
                          key={day} 
                          className={`h-24 border border-border rounded-lg p-2 ${
                            day === 14 ? 'bg-primary/10 border-primary' : ''
                          }`}
                        >
                          <div className={`text-right text-sm font-medium ${
                            day === 14 ? 'text-primary' : 'text-foreground'
                          }`}>
                            {day}
                          </div>
                          {hasEvent && (
                            <div className="mt-1 text-xs bg-primary/10 text-primary rounded px-2 py-1 truncate">
                              Event
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-6 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
                    <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all btn-with-border">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="p-4 bg-accent/50 rounded-lg border border-border">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <CalendarIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{event.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Add Event</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Event Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                        placeholder="Meeting title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                      />
                    </div>
                    <button
                      type="button"
                      className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium button-hover btn-with-border"
                    >
                      Create Event
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}