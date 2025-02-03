"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingContext } from "@/contexts/LoadingContext";
import { bookingServiceInstance } from "@/services";
import { IBooking } from "@/types";
import { getStatusBadge } from "@/utils";
import { formatDate } from "date-fns";
import { useContext, useEffect, useState } from "react";

function ProfileLastBookings() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const { setIsLoading } = useContext(LoadingContext);

  const listBookings = async () => {
    setIsLoading(true);

    try {
      const data = await bookingServiceInstance.listBookings();
      setBookings(data.slice(0, 5));
    } catch (error) {
      console.error("Error listing bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listBookings();
  }, []);

  return (
    <Card className="shadow-sm border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Últimas reservas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div className="space-y-1">
                <p className="font-medium">{booking.room.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(booking.date), "dd/MM/yyyy")} das{" "}
                  {formatDate(new Date(booking.startTime), "HH:mm")} às{" "}
                  {formatDate(new Date(booking.endTime), "HH:mm")}
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileLastBookings;
