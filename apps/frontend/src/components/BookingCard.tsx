import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInCalendarDays } from "date-fns";
import { baseCalendarClassName, baseCalendarModifiersClassNames } from "@/app/calendarStyles";

interface SeasonalPrice {
  id: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  price: number;
}

interface BookingCardProps {
  disabledDates: Date[];
  seasonalPrices: SeasonalPrice[];
  onSelectRange: (range: {
    startDate: Date | null;
    endDate: Date | null;
    totalNights: number;
  }) => void;
}

export default function BookingCard({ disabledDates, seasonalPrices, onSelectRange }: BookingCardProps) {
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (range?.from && range?.to) {
      const totalNights = differenceInCalendarDays(range.to, range.from);
      onSelectRange({ startDate: range.from, endDate: range.to, totalNights });
    } else {
      onSelectRange({ startDate: null, endDate: null, totalNights: 0 });
    }
  }, [range, onSelectRange]);

const specialDays: Date[] = seasonalPrices.flatMap(sp => {
  const days: Date[] = [];
  const rawStart = new Date(sp.startDate);
  const start = new Date(rawStart.getFullYear(), rawStart.getMonth(), rawStart.getDate() + 1); // 👈 corregido
  const end = new Date(sp.endDate);

  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  return days;
});


  return (
    <div className="w-full custom-calendar">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        pagedNavigation
        disabled={disabledDates}
        modifiers={{ special: specialDays }}
        modifiersClassNames={{
          special: "relative after:absolute after:bottom-[6px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-blue-700",
          ...baseCalendarModifiersClassNames,
          selected: "bg-[#1A5E8D] text-white font-bold",
        }}
        classNames={{
          ...baseCalendarClassName,
          day_selected: "text-[#1A5E8D] font-bold",
        }}
      />
    </div>
  );
}
