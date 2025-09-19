import { useEffect, useRef, useState } from "react";
import type { OptionType } from "../../mocks/types";
import { ChevronDown, Search, X } from "lucide-react";
import { dropdownLoadOptions } from "../../mocks";

interface MultiSelectDropdownProps {
  value?: OptionType[];
  setSelectedOptions?: (val: OptionType[]) => void;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  value = [],
  setSelectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keySelect, setkeySelect] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setkeySelect(-1);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchOptions = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await new Promise<OptionType[]>((resolve) =>
          setTimeout(() => resolve(dropdownLoadOptions ?? []), 1000)
        );
        setOptions(data);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.find((selected) => selected.value === option.value)
  );

  const handleSelect = (option: OptionType): void => {
    const newValue = [...value, option];
    setSelectedOptions?.(newValue);
    setSearchTerm("");
    setkeySelect(-1);
  };

  const handleRemove = (val: string): void => {
    const newValue = value.filter((item) => item.value !== val);
    setSelectedOptions?.(newValue);
  };

  const handleClearAll = (): void => {
    setSelectedOptions?.([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setkeySelect((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setkeySelect((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (keySelect >= 0) {
          handleSelect(filteredOptions[keySelect]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setkeySelect(-1);
        break;
    }
  };

  return (
    <div>
      <div ref={dropdownRef} className="z-10 relative">
        <div
          className="absolute w-full bg-white border border-gray-300 rounded-lg z-50 overflow-hidden"
          role="combobox"
          aria-expanded={isOpen}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              role="searchbox"
              aria-autocomplete="list"
              placeholder="Search..."
              value={searchTerm}
              onClick={() => setIsOpen(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              autoFocus
            />
            <div className="flex items-center gap-2 absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown
                onClick={() => setIsOpen(!isOpen)}
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {value.length > 0 && (
            <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200 flex-1">
              <div className="flex justify-between w-full">
                <div className="flex gap-1 flex-wrap">
                  {value.map((item) => (
                    <span
                      key={item.value}
                      className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm"
                    >
                      {item.label}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.value);
                        }}
                        className="hover:text-teal-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {value.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearAll();
                    }}
                    className="text-gray-400 items-end hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {isOpen && (
            <div
              className="max-h-60 overflow-y-auto"
              role="listbox"
              aria-activedescendant={
                keySelect >= 0
                  ? `option-${filteredOptions[keySelect].value}`
                  : undefined
              }
            >
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No options available
                </div>
              ) : (
                filteredOptions.map((option, idx) => (
                  <button
                    id={`option-${option.value}`}
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2 flex items-center justify-between ${
                      idx === keySelect ? "bg-gray-100" : ""
                    }`}
                    role="option"
                    aria-selected={idx === keySelect}
                  >
                    <span>{option.label}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
