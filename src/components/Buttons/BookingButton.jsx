import "./Buttons.css";

const BookingButton = ({ placeName }) => {
  if (!placeName) return null;

  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(placeName)}`;

  return (
    <div className="btn booking-btn">
      <img src="../public/assets/images/booking-logo.png" alt="" />
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="book-now-btn btn "
      >
        book now
      </a>
    </div>
  );
};

export default BookingButton;