// import React, { useEffect, useState } from 'react';
// import '../styles/ViewBooking.css';

// const ViewBookings = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     // Fetch the bookings from an API
//     fetch('/api/bookings')  // Replace with your API endpoint
//       .then((response) => response.json())
//       .then((data) => setBookings(data))
//       .catch((error) => console.error('Error fetching bookings:', error));
//   }, []);

//   return (
//     <div className="view-bookings">
//       <h2>Your Bookings</h2>
//       {bookings.length === 0 ? (
//         <p>No bookings found.</p>
//       ) : (
//         bookings.map((booking) => (
//           <div className="booking-card" key={booking.id}>
//             <p><strong>Game:</strong> {booking.game}</p>
//             <p><strong>Date:</strong> {booking.date}</p>
//             <p><strong>Time:</strong> {booking.time}</p>
//             <p><strong>Court:</strong> {booking.court}</p>
//             <p><strong>Location:</strong> {booking.location}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ViewBookings;


import React from 'react';
import '../styles/ViewBooking.css';

const ViewBookings = () => {
  // Hardcoded bookings for demo
  const bookings = [
    { date: '2024-02-27', time: '4 AM', game: 'Badminton', court: 'Court 1', center: 'HSR Layout' },
    { date: '2024-02-27', time: '5 AM', game: 'Badminton', court: 'Court 2', center: 'Koramangala' },
  ];

  return (
    <div className="view-bookings">
      <h3>Your Bookings</h3>
      {bookings.map((booking, index) => (
        <div key={index} className="booking-card">
          <p><strong>Date:</strong> {booking.date}</p>
          <p><strong>Time:</strong> {booking.time}</p>
          <p><strong>Game:</strong> {booking.game}</p>
          <p><strong>Court:</strong> {booking.court}</p>
          <p><strong>Center:</strong> {booking.center}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewBookings;

