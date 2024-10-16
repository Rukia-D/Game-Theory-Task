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

// Constants for dropdowns
const CENTRES_ORDER = ['Indira Nagar', 'HSR Layout', 'Electronic City', 'Whitefield', 'RT Nagar', 'Bagalur', 'Kaggadasapura'];
const SPORTS_ENUM = {
    BADMINTON: 'BADMINTON',
    SWIMMING: 'SWIMMING',
    CRICKET: 'CRICKET',
    TABLE_TENNIS: 'TABLE_TENNIS',
    FOOTBALL: 'FOOTBALL'
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
    const confirmBooking = window.confirm(`Do you want to book the slot for ${time.split(':')[0]}?`);
  
    if (confirmBooking) {
      try {
        const formattedDate = formatDateToYYYYMMDD(date);
        const formattedTime = parseInt(time.split(':')[0], 10); // Extract the hour part and convert to integer

        // Send the booking request to the backend
        await axios.post(
          'http://localhost:8006/api/v1/slots/customer/book',
          { sportName, date: formattedDate, time: formattedTime, courtNumber, centreName },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token here
            },
          }
        );

        // Re-fetch the available slots to reflect the latest state after booking
        fetchAvailableSlots();  // This will re-fetch the slots from the backend
  
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
          <option value="">Select Centre</option>
          {CENTRES_ORDER.map((centre, index) => (
            <option key={index} value={centre}>{centre}</option>
          ))}
        </select>

        <select value={sportName} onChange={(e) => setsportName(e.target.value)}>
          <option value="">Select Sport</option>
          {Object.entries(SPORTS_ENUM).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
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
                  className={court.status === 'occupied' ? 'booked' : 'available'}
                  onClick={() => court.status === 'free' && handleBooking(court.courtNumber, slot.time)}
                >
                  {court.status === 'occupied' ? 'Booked' : '+'}
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
