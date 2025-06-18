"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  BriefcaseBusiness,
  LogIn,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "./ModeToogle";

function Navbar() {
  const [user, setUser] = useState(true); // À connecter à ton auth réelle

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center h-16 justify-between px-4">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <BriefcaseBusiness className="md:size-12" />
          <span className="md:text-3xl font-bold font-mono tracking-wider">
            Josue Business
          </span>
        </Link>

        {/* Navigation actions */}
        <div className="md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-2 flex-row">
              <ModeToggle />
              <span className="hidden lg:inline ">User's name</span>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JB</AvatarFallback>
              </Avatar>
              
            </div>
          ) : (
            <>
              <Button variant="ghost" className="flex items-center gap-2" asChild>
                <Link href="/signin">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
              </Button>
              {/* <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/signout">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Link>
              </Button> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
