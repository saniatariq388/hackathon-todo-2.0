'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from "@/lib/auth-client";
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

    try {
      let response;

      if (isSignUp) {
        response = await signUp.email({ email, password, name });
      } else {
        response = await signIn.email({ email, password });
      }

      if (response?.data) {
        console.log("✅ Auth success:", response.data);

        // --- Save session to localStorage
        localStorage.setItem("better-auth-session", JSON.stringify(response.data));

        // --- Trigger storage event to notify TaskProvider
        window.dispatchEvent(new Event("storage"));

        // --- Redirect to dashboard
        router.push("/dashboard");
      } else if (response?.error) {
        console.error("❌ Auth error:", response.error);
        setError(response.error.message || "Authentication failed");
      }
    } catch (err: any) {
      console.error("❌ Auth exception:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border">
          <h1 className="text-3xl font-bold text-center mb-6">
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>

          {error && (
            <div className="bg-red-500/10 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 ml-1"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
