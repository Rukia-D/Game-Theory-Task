import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onSelectPage }) => {
  return (
    <div className="sidebar">
      <h2>GameTheory</h2>
      <ul>
        <li onClick={() => onSelectPage('view')}>View My Bookings</li>
        <li onClick={() => onSelectPage('book')}>Book a Slot</li>
        <li onClick={() => onSelectPage('schedule')}>Schedule</li> {/* Ensure this is included */}
      </ul>
    </div>
  );
};

export default Sidebar;
