import React, { useState, useEffect } from 'react';
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
  const [location, setLocation] = useState('');
  const [game, setGame] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);  // Store the slots fetched from the API

  const fetchAvailableSlots = async () => {
    try {
      const formattedDate = formatDateToYYYYMMDD(date);
      const response = await axios.post(
        'http://localhost:8006/customer/available', 
        { location, game, date: formattedDate },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );
      setSlots(response.data.slots); // Assuming the response contains a `slots` array
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleBooking = async (court, time) => {
    const confirmBooking = window.confirm(`Do you want to book the slot for ${time}?`);

    if (confirmBooking) {
      try {
        const formattedDate = formatDateToYYYYMMDD(date);
        await axios.post(
          'http://localhost:8006/customer/book',
          { location, game, date: formattedDate, time, court },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token here
            },
          }
        );

        // Update the slot status in the UI after successful booking
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.time === time && slot.court === court
              ? { ...slot, status: 'booked' }
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
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          <option value="hsr">HSR Layout</option>
          <option value="koramangala">Koramangala</option>
        </select>

        <select value={game} onChange={(e) => setGame(e.target.value)}>
          <option value="">Select Game</option>
          <option value="badminton">Badminton</option>
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
            <th>Court 3</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <tr key={index}>
              <td>{slot.time}</td>
              <td
                className={slot.court1.status === 'booked' ? 'booked' : 'available'}
                onClick={() => slot.court1.status === 'available' && handleBooking('Court 1', slot.time)}
              >
                {slot.court1.status}
              </td>
              <td
                className={slot.court2.status === 'booked' ? 'booked' : 'available'}
                onClick={() => slot.court2.status === 'available' && handleBooking('Court 2', slot.time)}
              >
                {slot.court2.status}
              </td>
              <td
                className={slot.court3.status === 'booked' ? 'booked' : 'available'}
                onClick={() => slot.court3.status === 'available' && handleBooking('Court 3', slot.time)}
              >
                {slot.court3.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookSlot;
