import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface SelectOptionItem<T extends string | number> {
  value: T;
  label: string;
  badge?: string;
}

interface LiquidSelectDropdownProps<T extends string | number> {
  label: string;
  value: T;
  options: SelectOptionItem<T>[];
  onChange: (value: T) => void;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  menuAlign?: 'left' | 'right';
}

export function LiquidSelectDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
  icon,
  isOpen,
  onToggle,
  onClose,
  menuAlign = 'left',
}: LiquidSelectDropdownProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-stone-200 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`w-full ${
          icon ? 'pl-9' : 'pl-3'
        } pr-8 py-2.5 rounded-lg bg-white/12 border text-left text-white text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 focus:outline-none ${
          isOpen
            ? 'border-[#E5C158] bg-white/16'
            : 'border-white/25 hover:border-[#E5C158]/70'
        }`}
      >
        {icon && (
          <span className="absolute left-3 bottom-[11px] pointer-events-none text-[#E5C158]">
            {icon}
          </span>
        )}
        <span className="truncate block">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-300 shrink-0 absolute right-2.5 bottom-[11px] pointer-events-none transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#E5C158]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            menuAlign === 'right' ? 'right-0' : 'left-0'
          } top-full mt-1.5 z-50 w-full min-w-[165px] rounded-xl bg-[#091E18]/96 backdrop-blur-xl border border-[#C59B27]/45 shadow-2xl overflow-hidden`}
        >
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    onClose();
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left text-xs md:text-[13px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#C59B27]/22 text-[#E5C158] font-semibold'
                      : 'text-stone-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span
                        className={`font-mono-num text-[10px] px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#C59B27] text-[#081A14] font-bold'
                            : 'bg-white/10 text-[#E5C158]'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E5C158]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface FullWidthDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const FullWidthDatePicker: React.FC<FullWidthDatePickerProps> = ({
  label,
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [viewYear, setViewYear] = useState<number>(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedDate.getMonth());

  useEffect(() => {
    if (isOpen) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [isOpen, selectedDate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const formattedLabel = useMemo(() => {
    const d = selectedDate;
    return `${String(d.getDate()).padStart(2, '0')} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [selectedDate]);

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
    const startOffset = (firstOfMonth.getDay() + 6) % 7;

    const cells: Array<{ date: Date | null; iso: string }> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: null, iso: `empty-start-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(viewYear, viewMonth, day);
      cells.push({ date: dateObj, iso: toIsoDate(dateObj) });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-stone-200 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`w-full pl-9 pr-8 py-2.5 rounded-lg bg-white/12 border text-left text-white text-sm transition-colors cursor-pointer flex items-center justify-between focus:outline-none ${
          isOpen
            ? 'border-[#E5C158] bg-white/16'
            : 'border-white/25 hover:border-[#E5C158]/70'
        }`}
      >
        <Calendar className="w-4 h-4 text-[#E5C158] absolute left-3 bottom-[11px] pointer-events-none" />
        <span className="truncate font-mono-num">{formattedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-300 absolute right-2.5 bottom-[11px] pointer-events-none transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#E5C158]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose Departure Date"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full rounded-xl bg-[#091E18]/96 backdrop-blur-xl border border-[#C59B27]/45 shadow-2xl p-3 text-white"
        >
          {/* Month / Year Navigation */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous Month"
              className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold tracking-wide text-[#E5C158]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="text-center text-[10px] font-semibold text-stone-400 py-0.5"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell) => {
              if (!cell.date) {
                return <div key={cell.iso} className="h-7" />;
              }
              const isPast = cell.date.getTime() < today.getTime();
              const isSelected = cell.iso === value;
              const isToday = cell.iso === toIsoDate(today);

              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange(cell.iso);
                    onClose();
                  }}
                  className={`h-7 w-full rounded-md text-xs font-mono-num flex items-center justify-center transition-colors ${
                    isPast
                      ? 'text-stone-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#C59B27] text-[#081A14] font-bold cursor-pointer'
                      : isToday
                      ? 'border border-[#E5C158]/60 text-[#E5C158] hover:bg-white/10 cursor-pointer'
                      : 'text-stone-100 hover:bg-white/12 hover:text-[#E5C158] cursor-pointer'
                  }`}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
