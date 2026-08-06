"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* Brand Logo */}
      <Link
        href="/"
        className="text-lg font-light tracking-wide text-foreground hover:text-foreground/80 transition-colors"
      >
        <span className="font-[500] mr-1">AX</span>LIST
      </Link>

      {/* Nav & Auth Links */}
      <div className="flex items-center text-card  gap-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            href="/my-list"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors leading-none"
          >
            My List
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors leading-none"
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
            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors leading-none"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
