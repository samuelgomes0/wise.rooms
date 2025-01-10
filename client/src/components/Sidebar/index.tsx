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
        id="sidebar-navigation"
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 md:w-72 w-full
        fixed lg:sticky h-screen top-0 left-0 bg-white z-50 shadow-md transition-transform transform-gpu ease-in-out duration-300
        ${pathName === "/entrar" ? "hidden" : ""}`}
        role="complementary"
        aria-hidden={pathName === "/entrar"}
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-2xl font-bold">wise.rooms</span>
        </div>
        <Nav onLinkClick={handleSidebarVisibility} />
        <div className="absolute bottom-0 w-full p-4 border-t">
          <UserDropdown />
        </div>
      </aside>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSidebarVisibility}
        aria-label="Alterar visibilidade do menu"
        aria-expanded={sidebarOpen}
        aria-controls="sidebar-navigation"
        className={`fixed top-4 left-4 z-50 shadow-sm bg-black text-white transition-transform duration-300 ease-in-out transform
          ${sidebarOpen ? "translate-x-[calc(100vw-4.5rem)]" : "translate-x-0"} 
          lg:hidden`}
      >
        <MenuIcon aria-hidden="true" />
      </Button>
    </div>
  );
}
