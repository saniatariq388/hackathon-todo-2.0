// frontend\src\app\dashboard\page.tsx
'use client';

import { useTasks } from "@/context/TaskContext";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Pencil, Check, X, Sun, Moon, BarChart3, Calendar, Home, Settings, Bell, User } from 'lucide-react';
import { useSession, signOut } from "@/lib/auth-client";
import { ModeToggle } from '@/components/ModeToggle';
import { Sidebar } from '@/components/Sidebar';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

export default function DashboardPage() {
 
  const [newTitle, setNewTitle] = useState('');
  const { tasks, loading, refreshTasks, addTask: addTaskContext } = useTasks();

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const router = useRouter();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    console.log('🟢 DASHBOARD MOUNTED');
    console.log('Session pending:', isPending);
    console.log('Session data:', session);

    if (!isPending && !session) {
      console.log('❌ No session - redirecting to login');
      router.push('/login');
      return;
    }
    if (session) {
      console.log('✅ Session found:', {
        userId: session.user.id,
        email: session.user.email,
        sessionId: session.session.id
      });
      refreshTasks();
    }
  }, [session, isPending, refreshTasks]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !session) return;

    console.log('➕ Adding new task:', newTitle);
    try {
      await addTaskContext(newTitle);  // Using context method for immediate update
      setNewTitle('');
    } catch (error) {
      console.error('❌ Failed to add task:', error);
    }
  };

// In dashboard/page.tsx, for example:
const toggleTask = async (task: any) => {
  if (!session) return
  try {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    await api.put(
      `/tasks/${task.id}`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${session.session.token}` },
      }
    )
    await refreshTasks()
  } catch (error) {
    console.error("Failed to toggle task", error)
  }
}

  const updateTaskTitle = async (id: number) => {
    if (!editTitle.trim() || !session) return;
    try {
      await api.put(`/tasks/${id}`, { title: editTitle }, {
        headers: { Authorization: `Bearer ${session.session.token}` }
      });
      await refreshTasks();
      setEditingTaskId(null);
    } catch (error) {
      console.error('Failed to update task title', error);
    }
  };

  const deleteTaskOriginal = async (id: number) => {
    if (!session) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${session.session.token}` }
      });
      await refreshTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  const handleLogout = async () => {
    await signOut({
        fetchOptions: {
            onSuccess: () => {
                router.push("/login");
            }
        }
    });
  };

  if (isPending || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">Loading your tasks...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="header-sticky py-4 px-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>/</span>
                <span>Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all btn-with-border relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
              </button>
              <ModeToggle />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground hidden md:block">
                  {session?.user?.name || session?.user?.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8 transition-all duration-300 card-hover">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What do you need to do today?"
                  className="flex-1 px-5 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-5 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium flex items-center gap-2 button-hover btn-with-border"
                  title="Add Task"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-all duration-300">
              {tasks.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-6">Add your first task to get started!</p>
                  <div className="bg-accent/50 rounded-lg p-4 inline-block">
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Tip:</span> Press Enter to quickly add tasks</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 text-sm font-medium text-muted-foreground border-b border-border">
                    <span>Status</span>
                    <span>Task</span>
                    <span>Actions</span>
                  </div>
                  <ul>
                    {tasks.map((task) => (
                      <li key={task.id} className="p-4 hover:bg-accent/50 transition-colors duration-200 group">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleTask(task)}
                            className="shrink-0 transition-transform hover:scale-110"
                            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {task.status === 'completed' ? (
                              <div className="relative">
                                <CheckCircle className="w-7 h-7 text-green-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-5 h-5 rounded-full bg-green-500/20"></div>
                                </div>
                              </div>
                            ) : (
                              <Circle className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            {editingTaskId === task.id ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') updateTaskTitle(task.id);
                                    if (e.key === 'Escape') cancelEditing();
                                  }}
                                />
                              </div>
                            ) : (
                              <span className={`truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingTaskId === task.id ? (
                              <>
                                <button
                                  onClick={() => updateTaskTitle(task.id)}
                                  className="p-2 rounded-lg text-green-600 hover:bg-green-500/10 transition-colors btn-with-border"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 transition-colors btn-with-border"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(task)}
                                  className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 transition-colors btn-with-border"
                                  title="Edit task"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteTaskOriginal(task.id)}
                                  className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 transition-colors btn-with-border"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tasks.length > 0 && (
                <div className="p-4 bg-accent/30 border-t border-border text-center text-sm text-muted-foreground">
                  You have <span className="font-medium text-foreground">{tasks.length}</span> {tasks.length === 1 ? 'task' : 'tasks'}
                  {tasks.filter(t => t.status === 'completed').length > 0 && (
                    <> - <span className="font-medium text-green-600">{tasks.filter(t => t.status === 'completed').length}</span> completed</>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer-sticky py-4 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}