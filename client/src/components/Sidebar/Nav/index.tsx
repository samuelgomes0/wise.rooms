import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import {
  BookOpen,
  BoxIcon,
  CalendarIcon,
  FileTextIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export function Nav({ onLinkClick }: { onLinkClick?: () => void }) {
  const { user, isAuthenticated } = useContext(AuthContext);

  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const mainNavItems = [
    { label: "Calendário", icon: CalendarIcon, path: "/" },
    {
      label: "Minhas reservas",
      icon: BookOpen,
      path: "/minhas-reservas",
    },
  ];

  const managementNavItems = [
    { label: "Reservas", icon: FileTextIcon, path: "/reservas" },
    { label: "Salas", icon: HomeIcon, path: "/salas" },
    { label: "Recursos", icon: BoxIcon, path: "/recursos" },
    { label: "Usuários", icon: UsersIcon, path: "/usuarios" },
    { label: "Auditoria", icon: SettingsIcon, path: "/auditoria" },
  ];

  return (
    <main role="main">
      <nav className="p-4">
        <ul role="list" className="space-y-2">
          {mainNavItems.map(({ label, icon: Icon, path }) => (
            <li key={label}>
              {label === "Minhas reservas" && !isAuthenticated ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled
                        aria-disabled="true"
                        aria-describedby="tooltip-login-message"
                        variant="ghost"
                        className={`w-full justify-start ${isActive(path) ? "bg-gray-100" : ""}`}
                        aria-current={isActive(path) ? "page" : undefined}
                      >
                        <Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                        {label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      id="tooltip-login-message"
                      className="text-sm"
                    >
                      Faça login para acessar
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link href={path} onClick={onLinkClick}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActive(path) ? "bg-gray-100" : ""}`}
                    aria-current={isActive(path) ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              )}
            </li>
          ))}
          {isAuthenticated &&
            user?.role.id === (Role.id.Administrador || Role.id.Supervisor) && (
              <>
                <h3 className="font-bold text-sm py-2">Gerenciamento</h3>
                {managementNavItems.map(({ label, icon: Icon, path }) => (
                  <li key={label}>
                    <Link href={path} onClick={onLinkClick}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive(path) ? "bg-gray-100" : ""}`}
                        aria-current={isActive(path) ? "page" : undefined}
                      >
                        <Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                        {label === "Auditoria" ? "Auditoria" : label}
                      </Button>
                    </Link>
                  </li>
                ))}
              </>
            )}
        </ul>
      </nav>
    </main>
  );
}
