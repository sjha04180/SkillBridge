'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X, Share2, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg transition-transform group-hover:scale-105">
                <Share2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive('/') ? 'text-white' : 'text-slate-400'
              }`}
            >
              Home
            </Link>
            
            {status === 'authenticated' && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive('/dashboard') ? 'text-white' : 'text-slate-400'
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center gap-4 pl-4 border-l border-border/10">
              {status === 'authenticated' ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1.5 border border-border/10">
                    <UserIcon className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-medium text-slate-200">
                      {session.user?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white cursor-pointer">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="gradient" size="sm" className="cursor-pointer">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-secondary hover:text-white focus:outline-hidden"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border/10" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive('/') ? 'bg-secondary text-white' : 'text-slate-400 hover:bg-secondary/50 hover:text-white'
              }`}
            >
              Home
            </Link>

            {status === 'authenticated' && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive('/dashboard') ? 'bg-secondary text-white' : 'text-slate-400 hover:bg-secondary/50 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Auth Actions */}
            <div className="border-t border-border/10 pt-4 pb-2 px-3">
              {status === 'authenticated' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm font-medium text-slate-200">
                      {session.user?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-white p-0 cursor-pointer animate-none"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5 inline" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full text-slate-300 border-border/30">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="gradient" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
