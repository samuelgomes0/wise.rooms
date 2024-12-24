"use client";

import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Nav } from "./Nav";
import { UserDropdown } from "./UserDropdown";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathName = usePathname();

  const handleSidebarVisibility = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 md:w-72
          fixed lg:sticky h-screen top-0 left-0 bg-white z-50 shadow-sm transition-transform transform-gpu ease-in-out duration-300
          ${pathName === "/entrar" ? "hidden" : ""}
        `}
        role="navigation"
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-2xl font-bold">wise.rooms</span>
        </div>
        <Nav />
        <div className="absolute bottom-0 w-full p-4 border-t">
          <UserDropdown />
        </div>
      </aside>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSidebarVisibility}
        aria-label="Alterar visibilidade do menu"
        className="fixed top-4 right-4 lg:hidden z-50 bg-white shadow-sm"
      >
        <MenuIcon />
      </Button>
    </div>
  );
}
