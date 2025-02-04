"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileLastBookingsSkeleton() {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Últimas reservas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div className="space-y-3 flex-1">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-3 mt-2" />
              </div>
              <Skeleton className="w-20 h-5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileLastBookingsSkeleton;
