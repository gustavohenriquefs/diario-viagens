import { MapPin } from '@phosphor-icons/react';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';

interface Option {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: Option[];
  showDropdown?: boolean;
  setSelectedOption: (option?: Option) => void;
}

export const Search = ({ options, setSelectedOption = () => { }, ...props }: SearchProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [value, setValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelectOption = (option: Option) => {
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
          {...props}
        />
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <MapPin size={20} />
        </div>
      </div>
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto dark:border-gray-600">
          {(options && options.length > 0) ? (
            options.map((option, index) => (
              <li
                key={option.id}
                className={`p-2 cursor-pointer ${highlightedIndex === index ? 'bg-steel-blue-100' : 'bg-steel-blue-50'
                  }`}
                onClick={() => handleSelectOption(option)}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500 dark:text-gray-400">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};
