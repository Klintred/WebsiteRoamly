import React, { useState } from "react";
import "./CustomCalendar.css";

const CustomCalendar = ({ selectedDates, setSelectedDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);

  const handleMonthChange = (e) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    setSelectedDates((prev) => {
      const [start, end] = prev;

      if (start && end) {
        return [clickedDate, null];
      }

      if (!start) {
        return [clickedDate, null];
      }

      if (clickedDate.getTime() < start.getTime()) {
        return [clickedDate, start];
      }

      return [start, clickedDate];
    });
  };

  const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDays = () => {
    const days = [];
    const [start, end] = selectedDates;

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

      const isStart = start && thisDate.getTime() === start.getTime();
      const isEnd = end && thisDate.getTime() === end.getTime();
      const isInRange =
        start &&
        end &&
        thisDate.getTime() > start.getTime() &&
        thisDate.getTime() < end.getTime();

      const classes = [
        "calendar-day",
        isInRange ? "in-range" : "",
        isStart ? "range-start" : "",
        isEnd ? "range-end" : ""
      ]
        .filter(Boolean)
        .join(" ");

      days.push(
        <div
          key={day}
          className={classes}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <select value={currentDate.getMonth()} onChange={handleMonthChange}>
          {months.map((month, idx) => (
            <option key={idx} value={idx}>{month}</option>
          ))}
        </select>

        <select value={currentDate.getFullYear()} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="calendar-grid">
        {weekdayLabels.map((day) => (
          <div className="calendar-weekday" key={day}>
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default CustomCalendar;
