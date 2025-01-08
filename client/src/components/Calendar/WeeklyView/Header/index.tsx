import { capitalizeString } from "@/utils";

interface WeeklyViewHeaderProps {
  weekDays: Date[];
}

export default function Header({ weekDays }: WeeklyViewHeaderProps) {
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="hidden md:grid gap-1 grid-cols-7 ">
      {weekDays.map((day, index) => (
        <div
          key={index}
          className={`mb-2 py-2 text-center items-center flex flex-col rounded shadow-sm ${isToday(day) ? "bg-secondary-foreground text-white" : "bg-white"}`}
        >
          <div
            className={`font-medium text-sm ${isToday(day) ? "text-[#B0B0B0]" : "text-read"}`}
          >
            {capitalizeString(
              day.toLocaleDateString("pt-BR", { weekday: "short" })
            )}
          </div>
          <div className="font-semibold text-xl">{day.getDate()}</div>
        </div>
      ))}
    </div>
  );
}
