import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminSchedule.css';

// Your token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5hZ2VySWQiOjEsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzI5MTA2NzYzLCJleHAiOjE3MzE2OTg3NjN9.ysoN8uUGrM_xFEHtNgFb9DGHLSJCt7S-JSdxYSVZg3k"; 

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [sportName, setSportName] = useState('');
  
  const fetchBookings = async () => {
    try {
      const response = await axios.post('http://localhost:8006/api/v1/slots/manager', {
        sportName,
        date: selectedDate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.timeSlots);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]); // Reset to empty on error
    }
  };

  useEffect(() => {
    if (selectedDate && sportName) {
      fetchBookings();
    }
  }, [selectedDate, sportName]);

  return (
    <div className="schedule">
      <h3>View Schedule</h3>
      <div className="search-bar">
        <select value={sportName} onChange={(e) => setSportName(e.target.value)}>
          <option value="">Select Sport</option>
          <option value="BADMINTON">Badminton</option>
          <option value="SWIMMING">Swimming</option>
          <option value="CRICKET">Cricket</option>
          <option value="TABLE_TENNIS">Table Tennis</option>
          <option value="FOOTBALL">Football</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchBookings}>View Bookings</button>
      </div>

      {/* Table for the schedule */}
      {selectedDate && sportName ? (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {bookings.length > 0 && bookings[0].courts.map((court) => (
                <th key={court.courtNumber}>Court {court.courtNumber}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((slot, index) => (
              <tr key={index}>
                <td>{slot.time}</td>
                {slot.courts.map((court) => (
                  <td key={court.courtNumber} className={court.status === 'occupied' ? 'booked' : 'available'}>
                    {court.status === 'occupied' ? (
                      <div>
                        <div className="user-info">
                          <small>{court.userInfo.name}</small>
                          <small>{court.userInfo.email}</small>
                        </div>
                      </div>
                    ) : (
                      <span>Free</span> // Optional: Add a "Free" text to indicate availability
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Please select a sport and date to view the schedule.</p>
      )}
    </div>
  );
};

export default Schedule;
