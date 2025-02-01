"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronDownIcon, LogOutIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export function UserDropdown() {
  const { user, signOut, isAuthenticated } = useContext(AuthContext);

  const { toast } = useToast();

  const handleLogout = () => {
    signOut();
    toast({
      title: Notification.SUCCESS.LOGOUT.TITLE,
      description: Notification.SUCCESS.LOGOUT.DESCRIPTION,
    });
  };

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between truncate"
              aria-label="Menu do usuário"
            >
              <User2Icon className="mr-2 flex-shrink-0" size={18} />
              <span className="truncate mr-2">{user?.name}</span>
              <ChevronDownIcon size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-md:w-[calc(100vw-2rem)]">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/perfil">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
            </Link>
            <DropdownMenuItem disabled>
              Configurações (em breve)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOutIcon className="mr-2" size={18} />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/entrar">
          <Button variant="default" className="w-full">
            Entrar
          </Button>
        </Link>
      )}
    </>
  );
}
