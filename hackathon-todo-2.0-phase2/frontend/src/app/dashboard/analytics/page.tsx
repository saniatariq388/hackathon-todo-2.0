'use client';

import { BarChart3, TrendingUp, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

export default function AnalyticsPage() {
  // Mock data for charts
  const taskData = [
    { day: 'Mon', completed: 4, pending: 2 },
    { day: 'Tue', completed: 6, pending: 1 },
    { day: 'Wed', completed: 3, pending: 4 },
    { day: 'Thu', completed: 8, pending: 0 },
    { day: 'Fri', completed: 5, pending: 3 },
    { day: 'Sat', completed: 2, pending: 5 },
    { day: 'Sun', completed: 7, pending: 1 },
  ];

  // Mock stats
  const stats = [
    { title: 'Total Tasks', value: '42', icon: BarChart3, change: '+12%' },
    { title: 'Completed', value: '32', icon: CheckCircle, change: '+8%' },
    { title: 'Pending', value: '10', icon: Clock, change: '-5%' },
    { title: 'Overdue', value: '3', icon: AlertTriangle, change: '+2%' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">Track your productivity and task completion</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                        <p className="text-xs text-green-500 mt-1 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change}
                        </p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Task Completion</h2>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all btn-with-border">
                        Week
                      </button>
                      <button className="px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all btn-with-border">
                        Month
                      </button>
                      <button className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground transition-all btn-with-border">
                        Year
                      </button>
                    </div>
                  </div>
                  
                  {/* Chart visualization */}
                  <div className="h-80 flex items-end justify-between pb-6">
                    {taskData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 px-1">
                        <div className="flex items-end justify-center h-48 gap-1 w-full">
                          <div 
                            className="w-8 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                            style={{ height: `${day.completed * 15}px` }}
                            title={`${day.completed} completed`}
                          ></div>
                          <div 
                            className="w-8 bg-yellow-500 rounded-t hover:bg-yellow-600 transition-all"
                            style={{ height: `${day.pending * 15}px` }}
                            title={`${day.pending} pending`}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-6 card-hover">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Productivity Insights</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <h3 className="font-medium text-foreground">Peak Hours</h3>
                      <p className="text-sm text-muted-foreground">Most productive: 9AM - 11AM</p>
                      <div className="w-full bg-secondary rounded-full h-2 mt-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <h3 className="font-medium text-foreground">Task Types</h3>
                      <p className="text-sm text-muted-foreground">Work: 60%, Personal: 40%</p>
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1 bg-primary h-2 rounded-full"></div>
                        <div className="flex-1 bg-secondary h-2 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <h3 className="font-medium text-foreground">Completion Rate</h3>
                      <p className="text-sm text-muted-foreground">Weekly: 85%</p>
                      <div className="w-full bg-secondary rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500/10 p-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Completed "Project Report"</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Created new task</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-500/10 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Scheduled meeting</p>
                        <p className="text-xs text-muted-foreground">Jan 12</p>
                      </div>
                    </div>
                  </div>
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