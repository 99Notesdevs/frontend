"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/config/api/route";
import {
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showEditorForm, setShowEditorForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = (await api.post(`/admin`, {
        email: username,
        password: password,
        secretKey: secret,
      })) as { success: boolean };

      if (response.success) {
        router.push("/dashboard/manageemployees");
      } else {
        setError("wrong-password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("wrong-password");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = (await api.post(`/editor/login`, {
        email: username,
        password: password,
      })) as { success: boolean };

      if (response.success) {
        router.push("/dashboard/edit");
      } else {
        setError("wrong-password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("wrong-password");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = (await api.post(`/author/login`, {
        email: username,
        password: password,
      })) as { success: boolean };

      if (response.success) {
        router.push("/dashboard/add");
      } else {
        setError("wrong-password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("wrong-password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--admin-bg-lightest)] via-white to-[var(--bg-elevated)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 p-0">
        <div className="flex flex-col items-center">
          {/* Show heading only if no form is selected */}
          {!showAdminForm && !showEditorForm && !showAuthorForm && (
            <h2 className="text-center text-5xl font-bold tracking-tight text-[var(--admin-bg-dark)] font-sans">
              Welcome Back
            </h2>
          )}
          {/* Show dynamic heading when a form is selected */}
          {showAdminForm && (
            <h2 className="text-center text-4xl font-bold tracking-tight text-[var(--admin-bg-dark)] font-sans mb-2 uppercase">
              Admin Login
            </h2>
          )}
          {showEditorForm && (
            <h2 className="text-center text-4xl font-bold tracking-tight text-[var(--admin-bg-dark)] font-sans mb-2 uppercase">
              Editor Login
            </h2>
          )}
          {showAuthorForm && (
            <h2 className="text-center text-4xl font-bold tracking-tight text-[var(--admin-bg-dark)] font-sans mb-2 uppercase">
              Author Login
            </h2>
          )}
          {/* Placeholder as heading when no form is selected */}
          {!showAdminForm && !showEditorForm && !showAuthorForm && (
            <p className="mt-2 text-center text-base text-[var(--admin-primary)] font-medium">
              Please select your role to sign in
            </p>
          )}
        </div>
        {!showAdminForm && !showEditorForm && !showAuthorForm && (
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setShowAdminForm(true)}
              className="group relative w-full flex justify-center py-3 px-4 border border-[var(--accent)] text-base font-semibold rounded-lg text-white bg-[var(--primary)] shadow-sm hover:bg-[var(--secondary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
            >
              Sign in as Admin
            </button>
            <button
              onClick={() => setShowEditorForm(true)}
              className="group relative w-full flex justify-center py-3 px-4 border border-[var(--admin-scroll-thumb-hover)] text-base font-semibold rounded-lg text-[var(--admin-bg-dark)] bg-white shadow-sm hover:bg-[var(--secondary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              Sign in as Editor
            </button>
            <button
              onClick={() => setShowAuthorForm(true)}
              className="group relative w-full flex justify-center py-3 px-4 border border-[var(--accent)] text-base font-semibold rounded-lg text-white bg-[var(--primary)] shadow-sm hover:bg-[var(--secondary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
            >
              Sign in as Author
            </button>
          </div>
        )}
        {showAdminForm && (
          <form
            className="mt-8 space-y-6 animate-fade-in"
            onSubmit={handleAdminLogin}
          >
            <div className="space-y-4 p-6">
              <div className="relative flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg"
                  placeholder="Email address"
                />
              </div>
              <div className="relative flex items-center">
                <LockClosedIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg pr-8"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--admin-scroll-thumb-hover)] hover:text-[var(--admin-bg-primary)] focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="relative flex items-center">
                <KeyIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="secret"
                  name="secret"
                  type={showSecret ? "text" : "password"}
                  required
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg pr-8"
                  placeholder="Secret Key"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--admin-scroll-thumb-hover)] hover:text-[var(--admin-bg-primary)] focus:outline-none"
                  tabIndex={-1}
                >
                  {showSecret ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error === "wrong-password" && (
              <div className="text-[var(--critical)] text-sm mt-2 text-center animate-shake">
                Wrong password. Please try again.
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-2/3 mx-auto flex justify-center items-center gap-2 py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-[var(--primary)] shadow-sm hover:bg-[var(--secondary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </div>
          </form>
        )}
        {showEditorForm && (
          <form
            className="mt-8 space-y-6 animate-fade-in"
            onSubmit={handleEditorLogin}
          >
            <div className="space-y-4 p-6">
              <div className="relative flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg"
                  placeholder="Email address"
                />
              </div>
              <div className="relative flex items-center">
                <LockClosedIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg pr-8"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--admin-scroll-thumb-hover)] hover:text-[var(--admin-bg-primary)] focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error === "wrong-password" && (
              <div className="text-[var(--critical)] text-sm mt-2 text-center animate-shake">
                Wrong password. Please try again.
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-2/3 mx-auto flex justify-center items-center gap-2 py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-[var(--primary)] shadow-sm hover:bg-[var(--secondary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </div>
          </form>
        )}
        {showAuthorForm && (
          <form
            className="mt-8 space-y-6 animate-fade-in"
            onSubmit={handleAuthorLogin}
          >
            <div className="space-y-4 p-6">
              <div className="relative flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg"
                  placeholder="Email address"
                />
              </div>
              <div className="relative flex items-center">
                <LockClosedIcon className="h-5 w-5 text-[var(--admin-scroll-thumb-hover)] mr-2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0 py-2 border-0 border-b-2 border-[var(--admin-scroll-thumb-hover)] focus:border-[var(--admin-bg-primary)] focus:shadow-none outline-none bg-transparent transition-all duration-150 placeholder-[var(--admin-scroll-thumb-hover)] text-[var(--admin-bg-dark)] text-lg pr-8"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--admin-scroll-thumb-hover)] hover:text-[var(--admin-bg-primary)] focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error === "wrong-password" && (
              <div className="text-[var(--critical)] text-sm mt-2 text-center animate-shake">
                Wrong password. Please try again.
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-2/3 mx-auto flex justify-center items-center gap-2 py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-[var(--primary)] shadow-sm hover:bg-[var(--secondary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </div>
          </form>
        )}
        {(showAdminForm || showEditorForm || showAuthorForm) && (
          <button
            onClick={() => {
              setShowAdminForm(false);
              setShowEditorForm(false);
              setShowAuthorForm(false);
            }}
            className="mt-6 w-full text-base text-[var(--admin-secondary)] hover:text-[var(--admin-bg-dark)] font-medium transition-all duration-150 underline underline-offset-2"
          >
            Back to role selection
          </button>
        )}
      </div>
    </div>
  );
}
