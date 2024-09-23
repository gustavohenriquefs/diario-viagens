import { MapPin } from '@phosphor-icons/react';
import { InputHTMLAttributes, useEffect, useRef, useState, forwardRef } from 'react';
import { SearchOption } from './interfaces/search-options';

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: SearchOption[];
  showDropdown?: boolean;
  setSelectedOption: (option?: SearchOption) => void;
  initialValue?: string;
  resetValue?: string;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ options, setSelectedOption = () => { }, initialValue, resetValue, ...props }, ref) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [value, setValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSelectOption = (option: SearchOption) => {
      setSelectedOption(option);
      setValue(option.name);
      setShowDropdown(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setShowDropdown(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (options && options.length > 0) {
        if (e.key === 'ArrowDown') {
          setHighlightedIndex((prev) =>
            prev === null || prev === options.length - 1 ? 0 : prev + 1
          );
        } else if (e.key === 'ArrowUp') {
          setHighlightedIndex((prev) =>
            prev === null || prev === 0 ? options.length - 1 : prev - 1
          );
        } else if (e.key === 'Enter' && highlightedIndex !== null) {
          handleSelectOption(options[highlightedIndex]);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (initialValue) {
        setValue(initialValue);
      }
    }, [initialValue]);

    useEffect(() => {
      if (!resetValue || resetValue === '') {
        setValue('');
      }
    }, [resetValue]);

    return (
      <div className="relative w-100" ref={wrapperRef}>
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <input
            type="text"
            id="search"
            className="appearance-none pr-8 block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded px-3 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="Search branch name..."
            onFocus={() => setShowDropdown(true)}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete='off'
            required
            ref={ref}
            {...props}
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <MapPin size={20} />
          </div>
        </div>
        {showDropdown && (
          <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto dark:border-gray-600">
            {(options && options.length > 0) ? (
              options.map((option, index) => (
                <button
                  key={option.id}
                  className={`w-full p-2 cursor-pointer bg-steel-blue-50 hover:bg-steel-blue-100`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectOption(option);
                    }
                  }}
                  onClick={() => handleSelectOption(option)}
                >
                  {option.name}
                </button>
              ))
            ) : (
              <li className="p-2 text-gray-500">Sem resultados</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);
