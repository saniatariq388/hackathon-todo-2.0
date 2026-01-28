'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from "@/lib/auth-client";
import { ModeToggle } from '@/components/ModeToggle';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔵 AUTH STARTED');
    console.log('Mode:', isSignUp ? 'SIGNUP' : 'LOGIN');
    console.log('Email:', email);
    console.log('Name:', name);

    try {
      if (isSignUp) {
        console.log('📤 Sending signup request...');

        const response = await signUp.email({
          email,
          password,
          name,
        });

        if (response?.data) {
          console.log('✅ Signup successful!');
          console.log('Response data:', response.data);
          console.log('User:', response.data?.user);
          router.push("/dashboard");
        } else if (response?.error) {
          console.error('❌ SIGNUP ERROR:', response.error.message);
          setError(response.error.message || "Failed to sign up");
        }
      } else {
        console.log('📤 Sending login request...');

        const response = await signIn.email({
          email,
          password,
        });

        if (response?.data) {
          console.log('✅ Login successful!');
          console.log('Response data:', response.data);
          console.log('User:', response.data?.user);
          router.push("/dashboard");
        } else if (response?.error) {
          console.error('❌ LOGIN ERROR:', response.error.message);
          setError(response.error.message || "Failed to sign in");
        }
      }
    } catch (err: any) {
      console.error('❌ AUTH ERROR:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.error?.message || 'Authentication failed');
    } finally {
      setLoading(false);
      console.log('🔵 AUTH ENDED');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border transition-all duration-300 card-hover">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'Join us today' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/20 text-destructive p-3 rounded-lg mb-6 text-sm border border-destructive/30">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all btn-with-border"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed button-hover btn-with-border"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
