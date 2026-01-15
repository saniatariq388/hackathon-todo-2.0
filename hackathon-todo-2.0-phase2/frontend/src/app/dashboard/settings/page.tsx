'use client';

import { Settings, User, Lock, Bell, Palette, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Navigation</h2>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary">
                      <Settings className="w-5 h-5" />
                      <span>General</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Lock className="w-5 h-5" />
                      <span>Security</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Bell className="w-5 h-5" />
                      <span>Notifications</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Palette className="w-5 h-5" />
                      <span>Appearance</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Shield className="w-5 h-5" />
                      <span>Privacy</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <HelpCircle className="w-5 h-5" />
                      <span>Help & Support</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-6 card-hover">
                  <h2 className="text-xl font-semibold text-foreground mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                          <input
                            type="text"
                            defaultValue="John"
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                          <input
                            type="text"
                            defaultValue="Doe"
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <input
                            type="tel"
                            defaultValue="+1 (555) 123-4567"
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via push</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Enable dark theme</p>
                          </div>
                          <select 
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-medium button-hover btn-with-border">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 card-hover">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Danger Zone</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground">Delete Account</h3>
                      <p className="text-sm text-muted-foreground mb-4">Permanently remove your account and all data</p>
                      <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all font-medium button-hover btn-with-border">
                        Delete Account
                      </button>
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