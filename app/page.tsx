"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import {
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Loader2,
  Sprout,
  LogOut,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SP500Chart } from "@/components/homepage/SP500Chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type Modal = "none" | "login" | "signup";

const PORTAL_MAP: Record<string, string> = {
  supplier: "/supplier",
  manufacturer: "/manufacturer",
  investor: "/investor",
  admin: "/admin",
};

const portals = [
  {
    href: "/supplier",
    icon: Sprout,
    role: "Supplier",
    tagline: "Get paid immediately",
    description:
      "Submit invoices and receive funding within 24 hours — no more waiting 60–90 days.",
    color: "bg-brand-600",
    textColor: "text-brand-400",
    borderColor: "border-surface-700",
    perks: ["Instant liquidity", "Simple invoice submission", "Track every payment"],
  },
  {
    href: "/manufacturer",
    icon: ShoppingCart,
    role: "Manufacturer",
    tagline: "Keep your terms",
    description:
      "Pay on your normal schedule. Confirm invoices and manage upcoming obligations with ease.",
    color: "bg-ix-blue-500",
    textColor: "text-ix-blue-400",
    borderColor: "border-surface-700",
    perks: ["No early payment pressure", "Clear payment schedule", "One-click confirmations"],
  },
  {
    href: "/investor",
    icon: TrendingUp,
    role: "Investor",
    tagline: "Earn 8% APY",
    description:
      "Put your money to work backing real invoices. Predictable, asset-backed returns.",
    color: "bg-violet-600",
    textColor: "text-violet-400",
    borderColor: "border-violet-500/50",
    perks: ["8% annualized yield", "Asset-backed deals", "Start with any amount"],
    highlight: true,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [modal, setModal] = useState<Modal>("none");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-pt-14 bg-surface-900">
        {/* Navbar */}
        <header className="sticky top-0 z-40 h-14 border-b border-surface-800 bg-surface-900/90 backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="invoiceXchange logo" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-surface-0">
                invoiceXchange
              </span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href={PORTAL_MAP[user.user_metadata?.user_category] ?? "/"}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-800 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                      {(user.user_metadata?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm text-surface-300">
                      {user.user_metadata?.first_name ?? user.email}
                    </span>
                  </Link>
                  <form action="/api/auth/signout" method="post">
                    <Button type="submit" variant="ghost" size="icon-sm" className="text-surface-400 hover:text-red-400" title="Sign out">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-surface-300 hover:text-surface-0 hover:bg-surface-800"
                    onClick={() => setModal("login")}
                  >
                    Log in
                  </Button>
                  <Button size="sm" onClick={() => setModal("signup")}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative h-[calc(100vh-3.5rem)] snap-start flex flex-col items-center justify-center px-8 text-center overflow-hidden">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero-bg.mp4"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-surface-900/70" />
          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-400/10 px-4 py-1.5 text-sm font-medium text-accent-400 mb-6">
              <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
              the IX factor
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-surface-0 leading-tight max-w-3xl mx-auto">
              Suppliers get paid today.{" "}
              <span className="text-brand-400">Investors earn 8% APY.</span>
            </h1>
            <p className="mt-5 text-lg text-surface-400 max-w-2xl mx-auto">
              We bridge the gap between suppliers waiting 60 days to get paid and
              investors looking for predictable, real-asset-backed returns.
            </p>
            <div className="mt-10">
              <Button
                className="bg-gradient-to-r from-[#00C805] to-[#4A90E2] text-white px-16 py-5 text-xl font-bold shadow-xl rounded-xl hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  if (user) {
                    const role = user.user_metadata?.user_category as string | undefined;
                    router.push(role ? (PORTAL_MAP[role] ?? "/") : "/");
                  } else {
                    setModal("login");
                  }
                }}
              >
                Enter Portal
              </Button>
            </div>
          </div>
        </section>

        {/* Portal cards */}
        <section className="min-h-screen snap-start flex flex-col justify-center max-w-7xl mx-auto px-8 py-20">
          <p className="text-center text-sm font-medium text-surface-500 mb-8 uppercase tracking-widest">
            Choose your portal
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.href}
                  className={`relative flex flex-col rounded-2xl border ${portal.borderColor} bg-surface-800 p-6`}
                >
                  {portal.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                      Most popular
                    </div>
                  )}
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${portal.textColor} mb-1`}>
                    {portal.role}
                  </p>
                  <h2 className="text-lg font-bold text-surface-0 mb-2">{portal.tagline}</h2>
                  <p className="text-sm text-surface-400 leading-relaxed mb-5 flex-1">
                    {portal.description}
                  </p>
                  <ul className="space-y-1.5">
                    {portal.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-sm text-surface-400">
                        <CheckCircle className={`h-4 w-4 shrink-0 ${portal.textColor}`} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* S&P 500 vs invoiceXchange */}
        <section className="snap-start min-h-screen flex flex-col justify-center px-8 py-20">
          <div className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-surface-500 mb-3">
                Performance Comparison
              </p>
              <h2 className="text-3xl font-bold text-surface-0">
                S&amp;P 500 vs invoiceXchange
              </h2>
              <p className="mt-3 text-surface-400 max-w-xl mx-auto">
                S&amp;P 500 annual returns swing wildly — from +34% to −38%.
                invoiceXchange investors earn a predictable 8% APY, every year.
              </p>
            </div>
            <SP500Chart />
          </div>
        </section>

        {/* How it works */}
        <section className="snap-start border-t border-surface-800 bg-surface-800 py-16">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-center text-2xl font-bold text-surface-0 mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Supplier submits invoice",
                  body: "A supplier delivers goods and issues an invoice — say $10,000 due in 60 days.",
                },
                {
                  step: "2",
                  title: "Investors fund the deal",
                  body: "Retail investors pool funds to purchase the invoice. The supplier gets paid immediately.",
                },
                {
                  step: "3",
                  title: "Manufacturer pays, investors earn",
                  body: "When the manufacturer pays at maturity, investors receive their principal + 8% APY.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-surface-0 mb-2">{item.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="snap-start">
          <Footer />
        </div>
      </div>

      {/* Modals */}
      {modal === "login" && (
        <LoginModal
          onClose={() => setModal("none")}
          onSignup={() => setModal("signup")}
        />
      )}
      {modal === "signup" && (
        <SignupModal
          onClose={() => setModal("none")}
          onLogin={() => setModal("login")}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Login Modal
// ---------------------------------------------------------------------------

function LoginModal({
  onClose,
  onSignup,
}: {
  onClose: () => void;
  onSignup: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    const role = data.user.user_metadata?.user_category as string | undefined;
    const destination = role ? (PORTAL_MAP[role] ?? "/") : "/";

    if (!role) {
      setError("No role found for this account. Contact support.");
      setLoading(false);
      return;
    }

    router.push(destination);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="invoiceXchange logo" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-surface-900">invoiceXchange</span>
          </div>
          <h2 className="text-2xl font-bold text-surface-900">Welcome back</h2>
          <p className="text-sm text-surface-500 mt-1">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <button
                type="button"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button className="w-full mt-2" onClick={handleLogin} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-surface-500">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSignup}
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sign Up Modal
// ---------------------------------------------------------------------------

function SignupModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    if (!firstName || !lastName || !email || !userCategory || !password || !repeatPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_category: userCategory,
        },
      },
    });

    if (authError || !data.user) {
      setError(authError?.message ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Account created!</h2>
          <p className="text-sm text-surface-500 mb-1">
            We sent a confirmation email to
          </p>
          <p className="font-semibold text-surface-900 mb-4">{email}</p>
          <p className="text-sm text-surface-500 mb-6">
            Click the link in the email to activate your account, then come back to log in.
          </p>
          <Button className="w-full" onClick={() => { onClose(); onLogin(); }}>
            Go to Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="invoiceXchange logo" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-surface-900">invoiceXchange</span>
          </div>
          <h2 className="text-2xl font-bold text-surface-900">Create an account</h2>
          <p className="text-sm text-surface-500 mt-1">Get started in minutes</p>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="signup-first">First Name</Label>
              <Input
                id="signup-first"
                type="text"
                placeholder="Jane"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-last">Last Name</Label>
              <Input
                id="signup-last"
                type="text"
                placeholder="Smith"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Account type */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-category">Account Type</Label>
            <select
              id="signup-category"
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select your role…</option>
              <option value="supplier">Supplier — submit and track invoices</option>
              <option value="manufacturer">Manufacturer — confirm invoices and manage payments</option>
              <option value="investor">Investor — fund deals and earn yield</option>
            </select>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Repeat password */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-repeat">Confirm Password</Label>
            <div className="relative">
              <Input
                id="signup-repeat"
                type={showRepeat ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="pr-10"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
              <button
                type="button"
                onClick={() => setShowRepeat((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showRepeat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button className="w-full mt-2" onClick={handleSignup} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-surface-500">
          Already have an account?{" "}
          <button
            onClick={onLogin}
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
