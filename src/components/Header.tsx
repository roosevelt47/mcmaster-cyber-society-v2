"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { NAV, SITE } from "@/data/site";
import { buttonClass } from "@/components/ui";

const MOBILE_NAV = [...NAV, { label: "Join", href: "/join" }];

export function Header() {
  const pathname = usePathname();
  // Remember which path the menu was opened on, so it closes by itself on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const isOpen = openOn === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string): boolean => pathname === href || pathname.startsWith(`${href}/`);

  function closeMenu(returnFocus = false) {
    setOpenOn(null);
    if (returnFocus) toggleRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isOpen) closeMenu(true);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur"
      onKeyDown={handleKeyDown}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <nav aria-label="Main">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Image src="/logo.png" alt="" width={32} height={35} priority />
            <span className="hidden sm:inline">{SITE.name}</span>
            <span className="sm:hidden">{SITE.shortName}</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(item.href) ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link href="/join" className={buttonClass("primary", "min-h-10 py-2")}>
                Join
              </Link>
            </li>
          </ul>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-foreground md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Menu"
            onClick={() => setOpenOn(isOpen ? null : pathname)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <ul id="mobile-menu" className="border-t border-border px-4 pb-4 md:hidden">
            {MOBILE_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => closeMenu()}
                  className="block rounded-md px-3 py-3 text-base text-foreground hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
