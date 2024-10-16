import React, { useState } from 'react';
import '../styles/BookSlot.css';
import axios from 'axios';

// Your token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTcyOTA5MDA1OCwiZXhwIjoxNzMxNjgyMDU4fQ.OSbIHkH6ZsDK_uxUCR41rJIe7Uu-03F80tve-OxBF1o";

// Function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2); // Ensure two digits for month
  const day = (`0${d.getDate()}`).slice(-2); // Ensure two digits for day
  return `${year}-${month}-${day}`;
};

const BookSlot = () => {
  const [centreName, setcentreName] = useState('');
  const [sportName, setsportName] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);  // Store the slots fetched from the API

  const fetchAvailableSlots = async () => {
    try {
      const formattedDate = formatDateToYYYYMMDD(date);
      const response = await axios.post(
        'http://localhost:8006/api/v1/slots/customer/available', 
        { centreName, sportName, date: formattedDate },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );

      // Set slots from the response
      setSlots(response.data.timeSlots); // Now correctly setting timeSlots
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setSlots([]); // Reset to empty on error
    }
  };

  const handleBooking = async (courtNumber, time) => {
    const confirmBooking = window.confirm(`Do you want to book the slot for ${time}?`);

    if (confirmBooking) {
      try {
        const formattedDate = formatDateToYYYYMMDD(date);
        await axios.post(
          'http://localhost:8006/api/v1/slots/customer/book',
          { centreName, sportName, date: formattedDate, time, courtNumber },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token here
            },
          }
        );

        // Update the slot status in the UI after successful booking
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.time === time
              ? {
                  ...slot,
                  courts: slot.courts.map((court) =>
                    court.courtNumber === courtNumber
                      ? { ...court, status: 'booked' }
                      : court
                  ),
                }
              : slot
          )
        );

        alert('Slot successfully booked!');
      } catch (error) {
        console.error('Error booking the slot:', error);
        alert('Failed to book the slot');
      }
    }
  };

  return (
    <div className="book-slot">
      <h3>Book a Slot</h3>
      <div className="search-bar">
        <select value={centreName} onChange={(e) => setcentreName(e.target.value)}>
          <option value="">Select centreName</option>
          <option value="Indira Nagar">HSR Layout</option>
          <option value="koramangala">Koramangala</option>
        </select>

        <select value={sportName} onChange={(e) => setsportName(e.target.value)}>
          <option value="">Select sportName</option>
          <option value="SWIMMING">Badminton</option>
          <option value="tennis">Tennis</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchAvailableSlots}>Search</button>
      </div>

      {/* Table for available slots */}
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Court 1</th>
            <th>Court 2</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <tr key={index}>
                <td>{slot.time}</td>
                {slot.courts.map((court) => (
                  <td
                  key={court.courtNumber}
                  className={court.status === 'booked' ? 'booked' : 'available'}
                  onClick={() => court.status === 'free' && handleBooking(court.courtNumber, slot.time)}
                >
                  {court.status === 'booked' ? 'Booked' : '+'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookSlot;
