import React, { useState } from "react";

const CustomCalendar = ({ selectedDates, setSelectedDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);

  // Helper function to get the number of days in the month
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 0);
    return date.getDate();
  };

  // Months and years for the selection dropdowns
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", 
    "September", "October", "November", "December"
  ];

  const years = [];
  for (let year = new Date().getFullYear(); year <= new Date().getFullYear() + 5; year++) {
    years.push(year);
  }

  // Month and year selection handlers
  const handleMonthChange = (e) => {
    setCurrentDate(new Date(currentDate.getFullYear(), e.target.value, 1));
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(e.target.value, currentDate.getMonth(), 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDates((prev) => {
      if (prev[0] && prev[1]) {
        return [newDate, null]; // If there are already two dates, reset the selection
      } else if (!prev[0]) {
        return [newDate, null]; // Set the first date
      } else {
        return [prev[0], newDate]; // Set the second date
      }
    });
  };

  const handleHoverDate = (day) => {
    setHoverDate(day);
  };

  const handleLeaveHover = () => {
    setHoverDate(null);
  };

  const daysInMonth = getDaysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear());

  const renderDays = () => {
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected =
        (selectedDates[0] && selectedDates[0].getDate() === day) ||
        (selectedDates[1] && selectedDates[1].getDate() === day);
      const isHovered = hoverDate === day;
      const isRange =
        selectedDates[0] &&
        selectedDates[1] &&
        (day >= selectedDates[0].getDate() && day <= selectedDates[1].getDate());

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => handleHoverDate(day)}
          onMouseLeave={handleLeaveHover}
          style={{
            padding: "8px",
            margin: "4px",
            borderRadius: "4px",
            backgroundColor: isSelected ? "#4F46E5" : isHovered ? "#e5e7eb" : isRange ? "#d1d5db" : "#fff",
            cursor: "pointer",
          }}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Month and year selection */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <select
          value={currentDate.getMonth()}
          onChange={handleMonthChange}
          style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={currentDate.getFullYear()}
          onChange={handleYearChange}
          style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Days of the month */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
        {renderDays()}
      </div>
    </div>
  );
};

export default CustomCalendar;
