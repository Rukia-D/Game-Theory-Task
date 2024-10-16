import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewBooking.css';

// Your token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTcyOTA5MDA1OCwiZXhwIjoxNzMxNjgyMDU4fQ.OSbIHkH6ZsDK_uxUCR41rJIe7Uu-03F80tve-OxBF1o";

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:8006/api/v1/slots/customer/slots', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token here
                    },
                });

                // Check if slots is an array before setting state
                if (Array.isArray(response.data.slots)) {
                    setBookings(response.data.slots); // Set the slots to bookings
                } else {
                    setBookings([]); // Set to empty array if not an array
                    console.warn('Expected an array but received:', response.data.slots);
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to fetch bookings.'); // Set error message
            } finally {
                setLoading(false); // Stop loading after request
            }
        };

        fetchBookings(); // Call the function to fetch bookings
    }, []); // Empty dependency array means this effect runs once after the initial render

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>{error}</div>; // Show error message
    }

    return (
        <div className="view-bookings">
            <h3>Your Bookings</h3>
            {bookings.length === 0 ? (
                <p>No bookings found.</p> // Message when no bookings are available
            ) : (
                bookings.map((booking, index) => {
                    // Ensure booking structure is correct
                    const { date, time, court } = booking;
                    if (!court) {
                        console.warn(`Booking data is missing court or centre information:`, booking);
                        return null; // Skip this iteration if data is incomplete
                    }

                    const formattedTime = `${time}:00`; // Format the time (consider adding more formatting if needed)

                    return (
                        <div key={index} className="booking-card">
                            <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p> {/* Format the date */}
                            <p><strong>Time:</strong> {formattedTime}</p>
                            <p><strong>Game:</strong> {court.sport}</p>
                            <p><strong>Court:</strong> Court {court.courtNumber}</p>
                            <p><strong>Center:</strong> {court.centre.name}</p>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ViewBookings;
