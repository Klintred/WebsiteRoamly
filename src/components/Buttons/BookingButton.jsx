import "./Buttons.css";
import bookingIcon from "../../../public/assets/images/booking.png"; // Adjust path as needed

const BookingButton = ({ placeName }) => {
  if (!placeName) return null;

  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(placeName)}`;

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="booking-affiliate-btn"
    >
      <img src={bookingIcon} alt="Booking.com" className="booking-icon" />
      Book on Booking.com
    </a>
  );
};

export default BookingButton;
