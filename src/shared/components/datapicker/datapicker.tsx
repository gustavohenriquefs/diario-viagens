import { CalendarDots } from '@phosphor-icons/react';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Control, Controller } from 'react-hook-form';

interface DateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full">
      <CalendarDots
        className="absolute m-auto z-10 inset-y-0 start-0 flex items-center pl-3 pointer-events-none"
        size={32}
      />
      <DatePicker
        selected={value}
        onChange={onChange}
        className="w-full text-gray-500 text-sm outline-none border focus:border-steel-blue-700 rounded w-full pl-10 p-2.5"
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
};

interface DateRangeFormProps {
  control: Control<any>
}

export const DateRangeForm: React.FC<DateRangeFormProps> = ({ control }: DateRangeFormProps) => {
  return (
    <div>
      <div id="date-range-picker" className="flex items-center">
        <Controller
          name="date.start"
          control={control}
          render={({ field }) => (
            <DateInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Data inicial"
            />
          )}
        />
        
        <span className="mx-4 text-gray-500">para</span>

        <Controller
          name="date.end"
          control={control}
          render={({ field }) => (
            <DateInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Data final"
            />
          )}
        />
      </div>
    </div>
  );
};
