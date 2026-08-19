"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

const MotionLink = motion.create(Link);

export default function AuthForm({
  defaultMode = "login",
}: {
  defaultMode?: "register" | "login";
}) {
  const router = useRouter();
  const isRegister = defaultMode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    // Async action wrapped in a promise for Sonner
    const authPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }

        resolve(data);
      } catch (err: any) {
        reject(err.message || "An unexpected error occurred");
      }
    });

    toast.promise(authPromise, {
      loading: isRegister ? "Creating your account..." : "Signing in...",
      success: () => {
        router.push("/my-list");
        router.refresh();
        return isRegister ? "Account created successfully!" : "Welcome back!";
      },
      error: (err) => err,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden px-6 py-10 md:p-4">
      {/* Back to home link */}
      <motion.nav
        className="fixed left-3.5 md:left-6 lg:left-8 top-4"
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          href="/"
          className=" text-sm leading-none text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft />
        </Link>
      </motion.nav>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-neutral-800/80 bg-bg-cold/40 p-5 backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-6 space-y-1.5 text-center">
          <h1 className="text-[22px] font-bold tracking-wide text-neutral-200 md:text-2xl">
            {isRegister ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-neutral-400 md:text-sm">
            {isRegister
              ? "Enter your details below to register"
              : "Enter your credentials to access your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          {isRegister && (
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-medium text-neutral-300"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="frieren_mage"
                  value={formData.username}
                  onChange={handleChange}
                  required={isRegister}
                  className="h-11 rounded-xl border-0 border-neutral-800 bg-neutral-900/70 pl-10 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-700"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-neutral-300"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="frieren@party.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border-0 border-neutral-800 bg-neutral-900/70 pl-10 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-700"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-neutral-300"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border-0 border-neutral-800 bg-neutral-900/70 pl-10 pr-11 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-700"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition-colors hover:text-white focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showPassword ? (
                    <motion.div
                      key="eye-off"
                      initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <EyeOff className="h-4 w-4 text-neutral-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-open"
                      initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-700/80 bg-card/60 font-semibold text-neutral-100 transition-all hover:gap-4 hover:bg-card/10 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isRegister ? "Register" : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Mode Switcher */}
        <div className="mt-6 text-left text-xs text-neutral-400 sm:text-sm">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <MotionLink
                href="/auth/login"
                whileHover={{ x: 2, opacity: 0.8 }}
                className="inline-block font-medium text-neutral-200 underline underline-offset-4 transition-colors hover:text-white"
              >
                Sign In
              </MotionLink>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <MotionLink
                href="/auth/register"
                whileHover={{ x: 2, opacity: 0.8 }}
                className="inline-block font-medium text-neutral-200 underline underline-offset-4 transition-colors hover:text-white"
              >
                Create account
              </MotionLink>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
