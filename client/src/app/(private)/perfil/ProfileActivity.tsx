import { AuthContext } from "@/contexts/AuthContext";
import { Calendar, CircleX, FileText } from "lucide-react";
import { useContext } from "react";

function ProfileActivity() {
  const { user } = useContext(AuthContext);

  const stats = [
    {
      id: 1,
      label: "Total de reservas",
      value: user?.bookings?.length || 0,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 2,
      label: "Reservas este mês",
      value:
        user?.bookings?.filter(
          (booking) =>
            new Date(booking.date).getMonth() === new Date().getMonth()
        ).length || 0,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      id: 3,
      label: "Taxa de cancelamento",
      value: `${(
        ((user?.bookings?.filter((booking) => booking.status === "CANCELLED")
          .length ?? 0) /
          (user?.bookings?.length ?? 0)) *
        100
      ).toFixed(2)}%`,
      icon: CircleX,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="col-span-full">
        <h2 className="text-xl font-semibold">Atividade</h2>
      </div>
      {stats.map((stat) => (
        <div key={stat.id} className="p-4 rounded-lg bg-gray-50 space-y-2">
          <div className="text-2xl font-semibold flex justify-between">
            {stat.value}
            <div
              className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default ProfileActivity;
