'use client';

import { BarChart3, TrendingUp, Calendar, CheckCircle, Clock, AlertTriangle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useSession } from "@/lib/auth-client";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
      return;
    }
    if (session) {
      fetchTasks();
    }
  }, [session, isPending]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/', {
        headers: {
          Authorization: `Bearer ${session?.session.token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      if ((error as any).response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics based on actual tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate weekly trend (mock data based on actual task counts)
  const weeklyData = [
    { day: 'Mon', completed: Math.floor(completedTasks * 0.15), pending: Math.floor(pendingTasks * 0.15) },
    { day: 'Tue', completed: Math.floor(completedTasks * 0.2), pending: Math.floor(pendingTasks * 0.2) },
    { day: 'Wed', completed: Math.floor(completedTasks * 0.18), pending: Math.floor(pendingTasks * 0.18) },
    { day: 'Thu', completed: Math.floor(completedTasks * 0.22), pending: Math.floor(pendingTasks * 0.22) },
    { day: 'Fri', completed: Math.floor(completedTasks * 0.15), pending: Math.floor(pendingTasks * 0.15) },
    { day: 'Sat', completed: Math.floor(completedTasks * 0.05), pending: Math.floor(pendingTasks * 0.05) },
    { day: 'Sun', completed: Math.floor(completedTasks * 0.05), pending: Math.floor(pendingTasks * 0.05) },
  ];

  // Calculate changes compared to previous period (mock calculation)
  const prevTotal = totalTasks > 0 ? totalTasks - 2 : 0;
  const prevCompleted = completedTasks > 0 ? completedTasks - 1 : 0;
  const prevPending = pendingTasks > 0 ? pendingTasks - 1 : 0;

  const totalChange = prevTotal !== 0 ? Math.round(((totalTasks - prevTotal) / prevTotal) * 100) : 100;
  const completedChange = prevCompleted !== 0 ? Math.round(((completedTasks - prevCompleted) / prevCompleted) * 100) : 100;
  const pendingChange = prevPending !== 0 ? Math.round(((pendingTasks - prevPending) / prevPending) * 100) : -50;

  // Stats cards with real data
  const stats = [
    { title: 'Total Tasks', value: totalTasks.toString(), icon: BarChart3, change: `${totalChange >= 0 ? '+' : ''}${totalChange}%`, changeType: totalChange >= 0 ? 'positive' : 'negative' },
    { title: 'Completed', value: completedTasks.toString(), icon: CheckCircle, change: `${completedChange >= 0 ? '+' : ''}${completedChange}%`, changeType: completedChange >= 0 ? 'positive' : 'negative' },
    { title: 'Pending', value: pendingTasks.toString(), icon: Clock, change: `${pendingChange >= 0 ? '+' : ''}${pendingChange}%`, changeType: pendingChange >= 0 ? 'negative' : 'positive' },
    { title: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, change: `${completionRate >= 70 ? '+' : ''}${completionRate - 65}%`, changeType: completionRate >= 70 ? 'positive' : 'negative' },
  ];

  if (isPending || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">Loading analytics...</p>
      </div>
    </div>
  );

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
                const ChangeIcon = stat.changeType === 'positive' ? ArrowUp : stat.changeType === 'negative' ? ArrowDown : Minus;
                const changeColor = stat.changeType === 'positive' ? 'text-green-500' : stat.changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground';
                
                return (
                  <div key={index} className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                        <p className={`text-xs mt-1 flex items-center ${changeColor}`}>
                          <ChangeIcon className="w-3 h-3 mr-1" />
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
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 px-1">
                        <div className="flex items-end justify-center h-48 gap-1 w-full">
                          <div
                            className="w-8 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                            style={{ height: `${Math.max(day.completed * 10, 10)}px` }}
                            title={`${day.completed} completed`}
                          ></div>
                          <div
                            className="w-8 bg-yellow-500 rounded-t hover:bg-yellow-600 transition-all"
                            style={{ height: `${Math.max(day.pending * 10, 10)}px` }}
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
                      <h3 className="font-medium text-foreground">Completion Rate</h3>
                      <p className="text-sm text-muted-foreground">{completionRate}% of tasks completed</p>
                      <div className="w-full bg-secondary rounded-full h-2 mt-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <h3 className="font-medium text-foreground">Task Distribution</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed: {completedTasks}, Pending: {pendingTasks}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <div 
                          className="flex-1 bg-green-500 h-2 rounded-full" 
                          style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                        ></div>
                        <div 
                          className="flex-1 bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Completed</span>
                        <span>Pending</span>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <h3 className="font-medium text-foreground">Average Completion</h3>
                      <p className="text-sm text-muted-foreground">Per week: {Math.round(completedTasks / 4)} tasks</p>
                      <div className="w-full bg-secondary rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, completionRate * 0.8)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>

                  <div className="space-y-4">
                    {tasks.slice(0, 3).map((task, index) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          task.status === 'completed' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.status === 'completed' ? 'Completed' : 'Created'} •{' '}
                            {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No recent activity
                      </div>
                    )}
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