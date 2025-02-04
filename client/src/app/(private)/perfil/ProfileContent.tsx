"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { CalendarIcon, Edit, MailIcon } from "lucide-react";
import { useContext } from "react";
import { Profile } from ".";
import ProfileContentSkeleton from "./ProfileContentSkeleton";

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

  if (!user) {
    return <ProfileContentSkeleton />;
  }

  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {/* Caso o avatar seja dinâmico */}
              <AvatarImage alt={user.name} />
              <AvatarFallback className="text-xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              {user.role?.name ? (
                <span className="text-sm text-read">
                  {Role.label[user.role.name as keyof typeof Role.label]}
                </span>
              ) : (
                <Skeleton className="w-24 h-3" />
              )}
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailIcon className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>
              Membro desde:{" "}
              {user.createdAt
                ? formatCreatedAtDate(user.createdAt)
                : "Data não disponível"}
            </span>
          </div>
        </div>
        <div>
          <Profile.Activity />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileContent;
