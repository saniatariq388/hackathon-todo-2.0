'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle, Pencil, Check, X, Flag, Calendar, Tag, MoreVertical } from 'lucide-react';
import { useSession } from "@/lib/auth-client";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
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
      const response = await api.get('/tasks/');
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

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !session) return;

    try {
      const taskData: any = { 
        title: newTitle,
        priority: newPriority
      };
      
      if (newDescription) taskData.description = newDescription;
      if (newDueDate) taskData.due_date = newDueDate;

      const response = await api.post('/tasks/', taskData);
      setTasks([...tasks, response.data]);
      setNewTitle('');
      setNewDescription('');
      setNewPriority('medium');
      setNewDueDate('');
      setShowAdvancedForm(false);
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!session) return;
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await api.put(`/tasks/${task.id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error('Failed to toggle task', error);
    }
  };

  const updateTask = async (id: number) => {
    if (!editTitle.trim() || !session) return;
    try {
      const taskData: any = { 
        title: editTitle,
        priority: editPriority
      };
      
      if (editDescription) taskData.description = editDescription;
      if (editDueDate) taskData.due_date = editDueDate;

      const response = await api.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(t => t.id === id ? response.data : t));
      setEditingTaskId(null);
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (id: number) => {
    if (!session) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      setShowMoreMenu(null);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');
    setEditDueDate('');
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'pending') return task.status === 'pending';
    if (activeFilter === 'completed') return task.status === 'completed';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
              <p className="text-muted-foreground">Manage your daily tasks with priority and due dates</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              <button 
                className={`px-4 py-2 rounded-lg text-sm transition-all ${activeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm transition-all ${activeFilter === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm transition-all ${activeFilter === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </button>
            </div>

            {/* Add Task Form */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8 transition-all duration-300 card-hover">
              <form onSubmit={addTask} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What do you need to do today?"
                    className="flex-1 px-5 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border"
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
                </div>
                
                {showAdvancedForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                      <textarea
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Add details about this task..."
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setShowAdvancedForm(!showAdvancedForm)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAdvancedForm ? 'Hide options' : 'Add priority, due date, description'}
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-all duration-300">
              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-6">Add your first task to get started!</p>
                  <div className="bg-accent/50 rounded-lg p-4 inline-block">
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Tip:</span> Press Enter to quickly add tasks</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-muted-foreground border-b border-border">
                    <span className="col-span-1">Status</span>
                    <span className="col-span-5">Task</span>
                    <span className="col-span-2">Priority</span>
                    <span className="col-span-2">Due Date</span>
                    <span className="col-span-2">Actions</span>
                  </div>
                  <ul>
                    {filteredTasks.map((task) => (
                      <li key={task.id} className="p-4 hover:bg-accent/50 transition-colors duration-200 group relative">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1">
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
                          </div>

                          <div className="col-span-5">
                            {editingTaskId === task.id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') updateTask(task.id);
                                    if (e.key === 'Escape') cancelEditing();
                                  }}
                                />
                                <textarea
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  placeholder="Add details about this task..."
                                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border resize-none"
                                  rows={2}
                                />
                              </div>
                            ) : (
                              <div>
                                <span className={`block ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                  {task.title}
                                </span>
                                {task.description && (
                                  <p className={`text-sm mt-1 ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="col-span-2">
                            {editingTaskId === task.id ? (
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                                className="w-full px-2 py-1 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border text-sm"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                <Flag className={`w-3 h-3 ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            )}
                          </div>

                          <div className="col-span-2">
                            {editingTaskId === task.id ? (
                              <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="w-full px-2 py-1 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground btn-with-border text-sm"
                              />
                            ) : (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {task.due_date ? formatDate(task.due_date) : 'No due date'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-span-2 flex justify-end">
                            {editingTaskId === task.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => updateTask(task.id)}
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
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startEditing(task)}
                                  className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 transition-colors btn-with-border"
                                  title="Edit task"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                
                                <div className="relative">
                                  <button
                                    onClick={() => setShowMoreMenu(showMoreMenu === task.id ? null : task.id)}
                                    className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 transition-colors btn-with-border"
                                    title="More options"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {showMoreMenu === task.id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                                      <button
                                        onClick={() => {
                                          startEditing(task);
                                          setShowMoreMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                                      >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          deleteTask(task.id);
                                          setShowMoreMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredTasks.length > 0 && (
                <div className="p-4 bg-accent/30 border-t border-border text-center text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredTasks.length}</span> of{' '}
                  <span className="font-medium text-foreground">{tasks.length}</span> tasks
                  {tasks.filter(t => t.status === 'completed').length > 0 && (
                    <> • <span className="font-medium text-green-600">{tasks.filter(t => t.status === 'completed').length}</span> completed</>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}