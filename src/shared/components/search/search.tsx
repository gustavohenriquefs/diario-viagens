import { InputHTMLAttributes, useState } from 'react';

interface Option {
  id: number;
  name: string;
  lat: number,
  lng: number
}

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: Option[];
  showDropdown?: boolean;
  setSelectedOption: (option?: Option) => void;
}

export const Search = ({ options, setSelectedOption = (option?: Option) => { }, ...props }: SearchProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [value, setValue] = useState('');

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setValue(option.name);
    setShowDropdown(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative max-w-sm mx-auto">
      <label htmlFor="search" className="sr-only">Search</label>

      <div className="relative">
        <input
          type="text"
          id="search"
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search branch name..."
          onFocus={() => setShowDropdown(true)}
          value={value}
          onChange={handleChange}
          required
          {...props}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </div>
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto dark:border-gray-600">
          {(options && options.length > 0) ? (
            options.map(option => (
              <li
                key={option.id}
                className="p-2 cursor-pointer bg-steel-blue-50 hover:bg-steel-blue-100"
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