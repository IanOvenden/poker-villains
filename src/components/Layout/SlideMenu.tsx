"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import Image from "next/image";

const navItems = [
  { href: "/standings", label: "Standings" },
  { href: "/games", label: "Games" },
  { href: "/players", label: "Players" },
  { href: "/season", label: "Season" },
];

export default function SlideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { player } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-accent h-20 flex items-center px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex flex-col justify-center gap-1.5 items-start"
          aria-label="Open menu"
        >
          <span className="w-6 h-0.5 bg-white rounded-full" />
          <span className="w-4 h-0.5 bg-white rounded-full" />
          <span className="w-6 h-0.5 bg-white rounded-full" />
        </button>
        <div className="flex-1 flex justify-center">
          <Image
            src="/logo.png"
            alt="Poker Villains"
            width={120}
            height={56}
            className="object-contain invert mix-blend-screen"
            priority
          />
        </div>
        <div className="w-10" />
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="h-14 flex items-center px-4 border-b border-gray-100">
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-text-secondary"
            aria-label="Close menu"
          >
            ✕
          </button>
          <span className="ml-2 font-medium text-text-primary">Menu</span>
        </div>

        {/* Player info */}
        {player && (
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm text-text-secondary">Signed in as</p>
            <p className="font-medium text-text-primary">{player.name}</p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-accent text-white"
                  : "text-text-primary hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Profile + sign out */}
        <div className="px-4 py-6 border-t border-gray-100 flex flex-col gap-1">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/profile"
                ? "bg-accent text-white"
                : "text-text-primary hover:bg-gray-50"
            }`}
          >
            My Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-3 rounded-xl text-sm font-medium text-danger text-left hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
