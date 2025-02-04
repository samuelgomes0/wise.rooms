"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileContentSkeleton() {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-24 h-3 mt-3" />
            </div>
          </div>
          <Skeleton className="w-10 h-10 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Skeleton className="w-64 h-4" />
        <Skeleton className="w-72 h-4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileContentSkeleton;
