import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInCalendarDays } from "date-fns";
import { baseCalendarClassName, baseCalendarModifiersClassNames } from "@/app/calendarStyles";

interface BookingCardProps {
  disabledDates: Date[];
  onSelectRange: (range: {
    startDate: Date | null;
    endDate: Date | null;
    totalNights: number;
  }) => void;
}

export default function BookingCard({ disabledDates, onSelectRange }: BookingCardProps) {
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (range?.from && range?.to) {
      const totalNights = differenceInCalendarDays(range.to, range.from);
      onSelectRange({ startDate: range.from, endDate: range.to, totalNights });
    } else {
      onSelectRange({ startDate: null, endDate: null, totalNights: 0 });
    }
  }, [range, onSelectRange]);

  return (
    <div className="w-full custom-calendar">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        pagedNavigation
        disabled={disabledDates}
        modifiersClassNames={{
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
