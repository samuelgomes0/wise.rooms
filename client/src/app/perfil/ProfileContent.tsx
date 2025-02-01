"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { CalendarIcon, Edit, MailIcon } from "lucide-react";
import { useContext, useEffect } from "react";

function ProfileContent() {
  const { user } = useContext(AuthContext);

  const formatCreatedAtDate = (date: Date) => {
    const createdAt = new Date(date);
    return createdAt.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage />
              <AvatarFallback>{user?.name[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <Badge>
                {user?.role.name ? (
                  <span>
                    {Role.label[user.role.name as keyof typeof Role.label]}
                  </span>
                ) : (
                  <Skeleton className="w-24 h-3" />
                )}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MailIcon className="w-4 h-4" />
          <span>{user?.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          <span>
            Membro desde:{" "}
            {user?.createdAt
              ? formatCreatedAtDate(user.createdAt)
              : "Data não disponível"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileContent;
