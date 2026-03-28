"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Modal = "none" | "login" | "signup";

const portals = [
  {
    href: "/farmer",
    icon: Sprout,
    role: "Supplier",
    tagline: "Get paid immediately",
    description:
      "Submit invoices and receive funding within 24 hours — no more waiting 60–90 days.",
    color: "bg-emerald-600",
    textColor: "text-emerald-400",
    borderColor: "border-surface-700",
    perks: ["Instant liquidity", "Simple invoice submission", "Track every payment"],
  },
  {
    href: "/store",
    icon: ShoppingCart,
    role: "Manufacturer",
    tagline: "Keep your terms",
    description:
      "Pay on your normal schedule. Confirm invoices and manage upcoming obligations with ease.",
    color: "bg-blue-600",
    textColor: "text-blue-400",
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
  const [modal, setModal] = useState<Modal>("none");

  return (
    <>
      <div className="min-h-screen bg-surface-900">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-surface-800 bg-surface-900/90 backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-0">
                investorXchange
              </span>
            </div>
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-8 pt-16 pb-16 text-center">
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
          <div className="mt-8">
            <Button
              size="lg"
              className="bg-brand-600 hover:bg-brand-700 text-white px-10"
              onClick={() => setModal("login")}
            >
              Enter Portal
            </Button>
          </div>
        </section>

        {/* Portal cards */}
        <section className="max-w-7xl mx-auto px-8 pb-20">
          <p className="text-center text-sm font-medium text-surface-500 mb-8 uppercase tracking-widest">
            Choose your portal
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.href}
                  href={portal.href}
                  className={`group relative flex flex-col rounded-2xl border ${portal.borderColor} bg-surface-800 p-6 hover:bg-surface-700 transition-all hover:-translate-y-0.5`}
                >
                  {portal.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                      Most popular
                    </div>
                  )}

                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <p
                    className={`text-xs font-semibold uppercase tracking-widest ${portal.textColor} mb-1`}
                  >
                    {portal.role}
                  </p>
                  <h2 className="text-lg font-bold text-surface-0 mb-2">
                    {portal.tagline}
                  </h2>
                  <p className="text-sm text-surface-400 leading-relaxed mb-5 flex-1">
                    {portal.description}
                  </p>

                  <ul className="space-y-1.5">
                    {portal.perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-center gap-2 text-sm text-surface-400"
                      >
                        <CheckCircle
                          className={`h-4 w-4 shrink-0 ${portal.textColor}`}
                        />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-surface-800 bg-surface-800 py-16">
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
                <div
                  key={item.step}
                  className="flex flex-col items-center text-center"
                >
                  <div className="h-12 w-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-surface-0 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-surface-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
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

function LoginModal({
  onClose,
  onSignup,
}: {
  onClose: () => void;
  onSignup: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-surface-900">investorXchange</span>
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
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <button className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
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
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button className="w-full mt-2">Log in</Button>
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

function SignupModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-surface-900">investorXchange</span>
          </div>
          <h2 className="text-2xl font-bold text-surface-900">Create an account</h2>
          <p className="text-sm text-surface-500 mt-1">Get started in minutes</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="signup-business">Business Name</Label>
            <Input
              id="signup-business"
              type="text"
              placeholder="Acme Corp"
              autoComplete="organization"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-repeat">Repeat Password</Label>
            <div className="relative">
              <Input
                id="signup-repeat"
                type={showRepeat ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowRepeat((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showRepeat ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button className="w-full mt-2">Create Account</Button>
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
