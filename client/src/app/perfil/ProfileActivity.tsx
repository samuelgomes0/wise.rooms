import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, FileText } from "lucide-react";

function ProfileActivity() {
  const stats = [
    {
      id: 1,
      label: "Total de Reservas",
      value: "45",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 2,
      label: "Reservas este Mês",
      value: "12",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      id: 3,
      label: "Taxa de Comparecimento",
      value: "95%",
      icon: Check,
      color: "text-purple-600",
    },
  ];

  return (
    <Card className="shadow-sm border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="p-4 rounded-lg bg-gray-50 space-y-2">
              <div
                className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileActivity;
