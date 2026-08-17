// Inside Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    const checkAuth = () => {
      const hasToken = document.cookie
        .split("; ")
        .some((row) => row.startsWith("is_logged_in=true"));
      setIsAuthenticated(hasToken);
    };

    checkAuth();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Call the logout API to clear server cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setIsAuthenticated(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 flex h-12 w-full items-center justify-between px-6 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Link
        href="/"
        className="text-lg font-light tracking-wide text-foreground transition-colors hover:text-foreground/80"
      >
        <span className="mr-1 font-medium">AX</span>LIST
      </Link>

      <div className="flex items-center gap-6 text-card">
        <motion.div
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            href="/my-list"
            className="text-sm leading-none text-muted-foreground transition-colors hover:text-foreground"
          >
            My List
          </Link>
        </motion.div>

        {/* ONLY show auth links if mounted to prevent the hydration flash */}
        {isMounted &&
          (isAuthenticated ? (
            <motion.div
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <button
                onClick={handleLogout}
                className="cursor-pointer text-sm font-medium leading-none text-red-400 transition-colors hover:text-red-300"
              >
                Logout
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/auth/login"
                  className="text-sm leading-none text-muted-foreground transition-colors hover:text-foreground"
                >
                  Login
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/auth/register"
                  className="text-sm font-medium leading-none text-foreground transition-colors hover:text-foreground/80"
                >
                  Sign In
                </Link>
              </motion.div>
            </>
          ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;
