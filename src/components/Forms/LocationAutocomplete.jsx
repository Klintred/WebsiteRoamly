import React, { useState, useEffect, useRef } from "react";

const LocationAutocomplete = ({ placeholder, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputValue || hasSelected) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            inputValue
          )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [inputValue, hasSelected]);

  const handleSelect = (suggestion) => {
    const name = suggestion.display_name;
    setInputValue(name);
    setSuggestions([]);
    setActiveIndex(-1);
    setShowSuggestions(false);
    setHasSelected(true);
    onChange(name);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if ((e.key === "Enter" || e.key === "Tab") && activeIndex >= 0) {
      e.preventDefault(); // prevent tabbing away
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="autocomplete-wrapper" onKeyDown={handleKeyDown}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
          setHasSelected(false); // reset selection if user types again
          onChange(""); // clear external state until selection
        }}
        className="planner-input"
        autoComplete="off"
      />

      {showSuggestions && !hasSelected && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((sug, index) => (
            <li
              key={sug.place_id}
              onClick={() => handleSelect(sug)}
              className={index === activeIndex ? "active-suggestion" : ""}
            >
              {highlightMatch(sug.display_name, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
