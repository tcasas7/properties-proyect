import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInCalendarDays } from "date-fns";

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
          selected: "bg-[#4A7150] text-[#4A7150] font-bold",
          range_start: "bg-[#4A7150] text-white rounded-l-full",
          range_end: "bg-[#4A7150] text-white rounded-r-full",
          range_middle: "bg-[#FFF1F2] text-[#4A7150]",
          disabled: "text-gray-300 line-through",
        }}
        classNames={{
          caption: "text-[#4A7150] font-semibold",
          head_cell: "text-[#4A7150]",
          nav_button: "text-[#4A7150] fill-[#4A7150] stroke-[#4A7150] font-bold",
          day_selected: "text-[#4A7150] font-bold", // ← días seleccionados
          day_range_start: " text-[#4A7150] font-bold",
          day_range_end: "text-[#4A7150] font-bold",
          day_range_middle: "text-[#4A7150] font-semibold",
          
        }}
      />
    </div>
  );
}
