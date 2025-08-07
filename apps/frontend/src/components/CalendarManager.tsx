/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import api from '@/lib/api';
import type { Calendar as CalendarType } from '../../../../shared/types/calendar';
import { baseCalendarClassName, baseCalendarModifiersClassNames } from "@/app/calendarStyles";
import { confirmDialog } from './ConfrimDialog';
import { format } from 'date-fns';

interface Props {
  propertyId: number;
  pricePerNight?: number;
}

interface SeasonalPrice {
  id: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  price: number;
}

function parseUTCDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day); // mes empieza en 0
}



export default function CalendarManager({ propertyId, pricePerNight }: Props) {
  const [dates, setDates] = useState<CalendarType[]>([]);
  const [selection, setSelection] = useState<{ from?: Date; to?: Date }>({});
  const [isUnblockMode, setIsUnblockMode] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPrice[]>([]);
  const [customPriceForm, setCustomPriceForm] = useState({
    startDate: '',
    endDate: '',
    price: '',
  });

  const fetchSeasonalPrices = async () => {
    try {
      const res = await api.get<SeasonalPrice[]>(`/properties/${propertyId}/seasonal-prices`);
      setSeasonalPrices(res.data);
    } catch (err) {
      console.error('Error fetching seasonal prices:', err);
    }
  };

    useEffect(() => {
      fetchDates();
      fetchSeasonalPrices();
    }, []);

    const handleAddSeasonalPrice = async () => {
    try {
      const payload = {
        startDate: customPriceForm.startDate,
        endDate: customPriceForm.endDate,
        price: Number(customPriceForm.price),
      };

      const res = await api.post(`/properties/${propertyId}/seasonal-prices`, payload);
      setSeasonalPrices((prev) => [...prev, res.data]);
      setCustomPriceForm({ startDate: '', endDate: '', price: '' });
    } catch (err) {
      console.error('Error adding seasonal price:', err);
    }
  };
  

  const fetchDates = async () => {
    try {
      const res = await api.get<CalendarType[]>(`/calendar/${propertyId}`);
      setDates(res.data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const applyDateRange = async (start: Date, end: Date, isUnblock: boolean) => {
    let from = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    let to = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    if (from > to) [from, to] = [to, from];

      const current = new Date(from);
      while (isUnblock ? current <= to : current < to) {
      const localDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
      const isoDate = localDate.toISOString().split('T')[0];

      if (isUnblock) {
        try {
          const exists = dates.find(
            (d) => new Date(d.date).toDateString() === localDate.toDateString()
          );
          if (exists) {
            await api.delete(`/calendar/${propertyId}/${isoDate}`);
            setDates((prev) =>
              prev.filter((d) => {
                const dbDate = new Date(d.date).toISOString().split('T')[0];
                return dbDate !== isoDate;
              })
            );
          }
        } catch (err) {
          console.error('Error desbloqueando fecha:', err);
        }
      } else {
        try {
          const exists = dates.some(
            (d) => new Date(d.date).toDateString() === localDate.toDateString()
          );
          if (!exists) {
            const res = await api.post<CalendarType>('/calendar', {
              propertyId,
              date: localDate.toISOString(),
            });
            setDates((prev) => [...prev, res.data]);
          }
        } catch (err) {
          console.error('Error bloqueando fecha:', err);
        }
      }

      current.setDate(current.getDate() + 1);
    }
  };

  const handleDayClick = async (date: Date) => {
    const isBlocked = dates.some(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );

    if (!isUnblockMode && isBlocked) {
      return;
    }

    if (isUnblockMode && !isBlocked) {
      return;
    }

    if (!selection.from) {
      setSelection({ from: date });
      return;
    }

    const from = new Date(selection.from.getFullYear(), selection.from.getMonth(), selection.from.getDate());
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const nights = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));

    const price = pricePerNight && !isUnblockMode ? nights * pricePerNight : null;

  const confirmAction = await confirmDialog({
  message: isUnblockMode
    ? `¿Confirmás desbloquear del ${format(from, 'dd/MM/yyyy')} al ${format(to, 'dd/MM/yyyy')}?`
    : `¿Confirmás bloquear ${nights} noche(s) del ${format(from, 'dd/MM/yyyy')} al ${format(to, 'dd/MM/yyyy')}?\nDía de salida (${format(to, 'dd/MM/yyyy')}).${price ? `\nTotal estimado: $${price}` : ''}`,
  confirmLabel: isUnblockMode ? 'Desbloquear' : 'Bloquear',
  cancelLabel: 'Cancelar',
});

    if (confirmAction) {
      applyDateRange(from, to, isUnblockMode);
    }

    setSelection({});
  };

  const pendingRange =
    selection.from && hoveredDate
       ? {
         from: selection.from < hoveredDate ? selection.from : hoveredDate,
         to: selection.from > hoveredDate ? selection.from : hoveredDate,
        }
      : undefined;

  const getBlockedDates = () => {
    return dates
      .map((d) => {
        const date = new Date(d.date);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      })
      .filter((d) => !isNaN(d.getTime()));
  };

  const rangeClassName = isUnblockMode
  ? "bg-[#E2F2F9] text-[#1A5E8D] font-semibold border border-dashed border-[#1A5E8D]"
  : "bg-[#A8D8E8] text-[#1A5E8D] font-semibold";


return (
  <div className="mt-4 custom-calendar">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-[#1A5E8D]">Calendario de disponibilidad</h4>
      <label className="flex items-center gap-2 text-sm text-[#1A5E8D]">
        <input
          type="checkbox"
          checked={isUnblockMode}
          onChange={() => {
            setIsUnblockMode(!isUnblockMode);
            setSelection({});
          }}
        />
        Modo desbloqueo
      </label>
    </div>

    <DayPicker
      mode="single"
      selected={undefined}
      onDayClick={handleDayClick}
      onDayMouseEnter={(date) => setHoveredDate(date)}
      onDayMouseLeave={() => setHoveredDate(undefined)}
      numberOfMonths={1}
      pagedNavigation
      modifiers={{
      blocked: getBlockedDates(),
      pendingRange,
      hasCustomPrice: seasonalPrices.flatMap((p) => {
        const start = parseUTCDateOnly(p.startDate);
        const end = parseUTCDateOnly(p.endDate);
        const days: Date[] = [];
        const current = new Date(start);

        while (current < end) {
          days.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }

        return days;
      }),

      }}
      modifiersClassNames={{
        ...baseCalendarModifiersClassNames,
        blocked: "unavailable-date",
        pendingRange: rangeClassName,
        selected: "bg-[#1A5E8D] text-white font-bold",
        hasCustomPrice: "bg-blue-200 text-[#1A5E8D] font-semibold",
      }}
      classNames={{
        ...baseCalendarClassName,
        day_selected: "text-white bg-[#1A5E8D] font-bold",
      }}
    />
        <hr className="my-4" />
        <div className="space-y-3 mt-6">
          <h4 className="font-semibold text-[#1A5E8D]">Precios personalizados</h4>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <input
              type="date"
              value={customPriceForm.startDate}
              onChange={(e) => setCustomPriceForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className="p-2 border rounded text-sm text-[#1A5E8D]"
            />
            <input
              type="date"
              value={customPriceForm.endDate}
              onChange={(e) => setCustomPriceForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className="p-2 border rounded text-sm text-[#1A5E8D]"
            />
            <input
              type="number"
              placeholder="Precio"
              value={customPriceForm.price}
              onChange={(e) => setCustomPriceForm((prev) => ({ ...prev, price: e.target.value }))}
              className="p-2 border rounded text-sm text-[#1A5E8D]"
            />
            <button
              onClick={handleAddSeasonalPrice}
              className="bg-[#1A5E8D] text-white px-4 py-2 rounded text-sm hover:bg-[#154a72]"
            >
              Agregar
            </button>
          </div>
      {seasonalPrices.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-l text-[#1A5E8D]">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Desde</th>
                <th className="px-2 py-1 text-left">Hasta</th>
                <th className="px-2 py-1 text-left">Precio</th>
                <th className="px-2 py-1 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {seasonalPrices.map((sp) => (
                <tr key={sp.id} className="border-t">
                <td className="px-2 py-1">
                  {format(parseUTCDateOnly(sp.startDate), 'dd/MM/yyyy')}
                </td>
                <td className="px-2 py-1">
                  {format(parseUTCDateOnly(sp.endDate).setDate(parseUTCDateOnly(sp.endDate).getDate() - 1), 'dd/MM/yyyy')}
                </td>
                  <td className="px-2 py-1">${sp.price}</td>
                  <td className="px-2 py-1 flex gap-2">
                    <button
                      onClick={async () => {
                        const newPrice = await confirmDialog({
                          message: `Editar precio del ${format(parseUTCDateOnly(sp.startDate), 'dd/MM/yyyy')} al ${format(parseUTCDateOnly(sp.endDate).setDate(parseUTCDateOnly(sp.endDate).getDate() - 1), 'dd/MM/yyyy')}`,
                          confirmLabel: 'Guardar',
                          cancelLabel: 'Cancelar',
                          showInput: true,
                          defaultValue: sp.price.toString(),
                        });

                        if (newPrice && typeof newPrice === 'string' && !isNaN(Number(newPrice))) {
                          await api.put(`/properties/${propertyId}/seasonal-prices/${sp.id}`, {
                            startDate: sp.startDate,
                            endDate: sp.endDate,
                            price: Number(newPrice),
                          });
                          fetchSeasonalPrices();
                        }
                      }}
                      className="bg-[#1A5E8D] text-white px-4 py-2 rounded text-sm hover:bg-[#154a72]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        const confirm = await confirmDialog({
                          message: `¿Querés eliminar el precio del ${format(new Date(sp.startDate), 'dd/MM/yyyy')} al ${format(new Date(sp.endDate), 'dd/MM/yyyy')}?`,
                          confirmLabel: 'Eliminar',
                          cancelLabel: 'Cancelar',
                        });

                        if (confirm) {
                          await api.delete(`/properties/${propertyId}/seasonal-prices/${sp.id}`);
                          fetchSeasonalPrices();
                        }
                      }}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
      <style>{`
        .unavailable-date {
          background: transparent;
          color: #1A5E8D;
          opacity: 0.5;
          text-decoration: line-through;
          font-weight: normal;
        }

        .custom-price-date {
        background-color: #1A5E8D;
        color: white;
        font-weight: bold;
        border-radius: 50%;
      }
          
      `}</style>
    </div>
  );

}
