"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AuthForm() {
  const [mode, setMode] = useState<"register" | "login">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitted (${mode}):`, formData);
  };

  const isRegister = mode === "register";

  return (
    <div className=" w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-bg-cold/40 border border-neutral-800/80 backdrop-blur-2xl relative z-10"
      >
        <div className="mb-6 text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-wide text-neutral-200">
            {isRegister ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-neutral-400">
            {isRegister
              ? "Enter your details below to register"
              : "Enter your credentials to access your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field (Shown only in Register mode) */}
          {isRegister && (
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-medium text-neutral-300"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="frieren_mage"
                  value={formData.username}
                  onChange={handleChange}
                  required={isRegister}
                  className="pl-10  bg-neutral-900/70 border-neutral-800 text-white placeholder:text-neutral-500  focus-visible:ring-neutral-700 focus-visible:border-neutral-600 h-11 rounded-xl"
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
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="frieren@party.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 bg-neutral-900/70 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-700 focus-visible:border-neutral-600 h-11 rounded-xl"
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-neutral-300"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="pl-10 pr-11 bg-neutral-900/70 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-700 focus-visible:border-neutral-600 h-11 rounded-xl"
              />

              {/* Animated Interactive Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors focus:outline-none p-1 rounded-md"
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
                      <EyeOff className="w-4 h-4 text-neutral-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-open"
                      initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Dark Submit Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              type="submit"
              className="w-full h-11 cursor-pointer rounded-xl bg-card/60 hover:bg-card/10 text-neutral-100 border border-neutral-700/80 font-semibold transition-all flex items-center justify-center gap-2 hover:gap-4"
            >
              {isRegister ? "Register" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </form>

        {/* Left-Aligned Bottom Mode Switcher */}
        <div className="mt-6 text-left text-xs sm:text-sm text-neutral-400  ">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <motion.button
                whileHover={{ x: 10, opacity: 0.7 }}
                type="button"
                onClick={() => setMode("login")}
                className="text-neutral-200 cursor-pointer font-medium underline underline-offset-4 transition-colors"
              >
                Sign In
              </motion.button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <motion.button
                whileHover={{ x: 10, opacity: 0.7 }}
                type="button"
                onClick={() => setMode("register")}
                className="text-neutral-200 cursor-pointer font-medium underline underline-offset-4 transition-colors"
              >
                Create account
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
