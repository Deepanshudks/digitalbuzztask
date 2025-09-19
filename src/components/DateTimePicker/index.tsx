import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Calendar,
} from "lucide-react";
import React, { useEffect, useRef, useState, type JSX } from "react";
import { dayNames, monthNames } from "../../mocks";

interface TimeState {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

interface DateTimeWidgetProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DateTimePicker: React.FC<DateTimeWidgetProps> = ({
  value,
  onChange,
  placeholder = "Select Date & Time",
  disabled = false,
  className = "",
  minDate = new Date(),
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [currentMonth, setCurrentMonth] = useState<Date>(value ?? new Date());
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [date, setDate] = useState<String>(placeholder);

  const [selectedTime, setSelectedTime] = useState<TimeState>(() => {
    const date = value ?? new Date();
    return {
      hour: date.getHours() % 12 || 12,
      minute: date.getMinutes(),
      period: date.getHours() >= 12 ? "PM" : "AM",
    };
  });

  const [quickRange, setQuickRange] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quickRangeOptions = [
    { label: "Today", value: "today" },
    { label: "Next 7 Days", value: "next7days" },
    { label: "This Month", value: "thismonth" },
  ];

  const addDays = (date: Date, days: number) => {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleQuickRange = (range: string) => {
    setQuickRange(range);

    let startDate = new Date(today);
    let endDate = new Date(today);

    if (range === "next7days") {
      endDate = addDays(today, 7);
    } else if (range === "thismonth") {
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    setRangeStartDate(startDate);
    setRangeEndDate(endDate);
    setSelectedDate(startDate);
    setCurrentMonth(startDate);
  };

  const displayValue =
    quickRange && rangeStartDate && rangeEndDate
      ? `${rangeStartDate.toLocaleDateString()} - ${rangeEndDate.toLocaleDateString()}`
      : selectedDate
      ? `${selectedDate.toLocaleDateString()}, ${selectedTime.hour
          .toString()
          .padStart(2, "0")}:${selectedTime.minute
          .toString()
          .padStart(2, "0")} ${selectedTime.period}`
      : placeholder;

  const handleSet = () => {
    const finalDateTime = new Date(selectedDate ?? "");
    let hour = selectedTime.hour;

    if (selectedTime.period === "PM" && hour !== 12) hour += 12;
    if (selectedTime.period === "AM" && hour === 12) hour = 0;

    finalDateTime.setHours(hour, selectedTime.minute, 0, 0);

    if (quickRange && rangeStartDate && rangeEndDate) {
      onChange?.(new Date(finalDateTime));
    } else {
      onChange?.(finalDateTime);
    }
    setDate(displayValue);

    setIsOpen(false);
  };

  const handleCancel = () => {
    setQuickRange("");
    setRangeStartDate(null);
    setRangeEndDate(null);
    setSelectedDate(value ?? null);
    setCurrentMonth(value ?? new Date());
  };

  const isDateDisabled = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (d < min) return true;
    }

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (d > max) return true;
    }

    return false;
  };

  const renderCalendar = (): JSX.Element => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();
    const firstDay = new Date(currentYear, currentMonthIndex, 1);
    const lastDay = new Date(currentYear, currentMonthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: JSX.Element[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(currentYear, currentMonthIndex, 0);
      const day = prevMonth.getDate() - startingDayOfWeek + i + 1;
      days.push(
        <div
          key={`prev-${day}`}
          className="p-2 text-gray-500 text-sm text-center"
        >
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const disabled = isDateDisabled(date);
      const inRange =
        rangeStartDate &&
        rangeEndDate &&
        date >= rangeStartDate &&
        date <= rangeEndDate;

      days.push(
        <button
          key={day}
          onClick={() => !disabled && setSelectedDate(date)}
          disabled={disabled}
          className={`p-2 text-sm w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${
              isSelected
                ? "bg-teal-500 text-white"
                : inRange
                ? "bg-teal-300 text-black"
                : isToday
                ? "bg-blue-100 text-blue-600"
                : disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-white hover:bg-gray-700"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div>
        <div className="flex items-center z-50 justify-between mb-4">
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentYear, currentMonthIndex - 1))
            }
            className="p-1 hover:bg-gray-700 rounded"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <div className="text-white font-medium">
            {monthNames[currentMonthIndex]} {currentYear}
          </div>
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentYear, currentMonthIndex + 1))
            }
            className="p-1 hover:bg-gray-700 rounded"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-xs text-gray-400 text-center font-medium"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const handleTimeKey = (
    e: React.KeyboardEvent<HTMLDivElement>,
    field: "hour" | "minute" | "period"
  ) => {
    if (field === "hour") {
      if (e.key === "ArrowUp")
        setSelectedTime((prev) => ({
          ...prev,
          hour: prev.hour === 12 ? 1 : prev.hour + 1,
        }));
      if (e.key === "ArrowDown")
        setSelectedTime((prev) => ({
          ...prev,
          hour: prev.hour === 1 ? 12 : prev.hour - 1,
        }));
    }

    if (field === "minute") {
      if (e.key === "ArrowUp")
        setSelectedTime((prev) => ({
          ...prev,
          minute: prev.minute === 59 ? 0 : prev.minute + 1,
        }));
      if (e.key === "ArrowDown")
        setSelectedTime((prev) => ({
          ...prev,
          minute: prev.minute === 0 ? 59 : prev.minute - 1,
        }));
    }

    if (field === "period") {
      if (e.key === "ArrowUp" || e.key === "ArrowDown")
        setSelectedTime((prev) => ({
          ...prev,
          period: prev.period === "AM" ? "PM" : "AM",
        }));
    }
  };

  const renderTimePicker = (): JSX.Element => (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div
        className="flex flex-col items-center"
        tabIndex={0}
        onKeyDown={(e) => handleTimeKey(e, "hour")}
      >
        <button
          onClick={() =>
            setSelectedTime((prev) => ({
              ...prev,
              hour: prev.hour === 12 ? 1 : prev.hour + 1,
            }))
          }
          className="p-1 hover:bg-gray-600 rounded"
        >
          <ChevronUp className="w-3 h-3 text-gray-300" />
        </button>
        <div className="bg-white px-3 py-1 rounded text-black font-mono">
          {selectedTime.hour.toString().padStart(2, "0")}
        </div>
        <button
          onClick={() =>
            setSelectedTime((prev) => ({
              ...prev,
              hour: prev.hour === 1 ? 12 : prev.hour - 1,
            }))
          }
          className="p-1 hover:bg-gray-600 rounded"
        >
          <ChevronDown className="w-3 h-3 text-gray-300" />
        </button>
      </div>

      <span className="text-white">:</span>

      <div
        className="flex flex-col items-center"
        tabIndex={0}
        onKeyDown={(e) => handleTimeKey(e, "minute")}
      >
        <button
          onClick={() =>
            setSelectedTime((prev) => ({
              ...prev,
              minute: prev.minute === 59 ? 0 : prev.minute + 1,
            }))
          }
          className="p-1 hover:bg-gray-600 rounded"
        >
          <ChevronUp className="w-3 h-3 text-gray-300" />
        </button>
        <div className="bg-white px-3 py-1 rounded text-black font-mono">
          {selectedTime.minute.toString().padStart(2, "0")}
        </div>
        <button
          onClick={() =>
            setSelectedTime((prev) => ({
              ...prev,
              minute: prev.minute === 0 ? 59 : prev.minute - 1,
            }))
          }
          className="p-1 hover:bg-gray-600 rounded"
        >
          <ChevronDown className="w-3 h-3 text-gray-300" />
        </button>
      </div>

      <div tabIndex={0} onKeyDown={(e) => handleTimeKey(e, "period")}>
        <button
          onClick={() =>
            setSelectedTime((prev) => ({
              ...prev,
              period: prev.period === "AM" ? "PM" : "AM",
            }))
          }
          className="bg-white px-3 py-1 rounded text-black font-mono ml-2"
        >
          {selectedTime.period}
        </button>
      </div>
    </div>
  );

  return (
    <div ref={widgetRef} className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors w-full ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm flex-1 text-left">{date}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute  mt-2 bg-slate-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50 min-w-80">
          <div className="flex gap-2 mb-4">
            {quickRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickRange(option.value)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  quickRange === option.value
                    ? "bg-teal-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {renderCalendar()}
          {renderTimePicker()}

          <div className="flex justify-between">
            <button
              onClick={() => {
                handleCancel();
                setIsOpen(false);
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSet}
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
            >
              Set
            </button>
          </div>

          {(selectedDate || (quickRange && rangeEndDate)) && (
            <div className="mt-2 text-xs text-gray-400 flex justify-between text-center">
              <span>{displayValue}</span>{" "}
              <span
                className="text-red-400 cursor-pointer hover:text-red-600 "
                onClick={() => handleCancel()}
              >
                Clear
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
