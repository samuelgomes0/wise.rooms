import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProfileLastBookings() {
  const bookings = [
    {
      id: "1",
      room: "Laboratório de Informática 1",
      date: "18/01/2025",
      time: "10:00 - 12:00",
      status: "CONFIRMED" as const,
    },
    {
      id: "2",
      room: "Sala de Treinamento",
      date: "17/01/2025",
      time: "13:00 - 15:00",
      status: "COMPLETED" as const,
    },
    {
      id: "3",
      room: "Espaço de Coworking",
      date: "18/01/2025",
      time: "08:00 - 10:00",
      status: "CONFIRMED" as const,
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Reservas Recentes
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
                <p className="font-medium">{booking.room}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.date} • {booking.time}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
}) {
  const variants = {
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const labels = {
    CONFIRMED: "Confirmado",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default ProfileLastBookings;
