// Sidebar.js
import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onSelectPage, user }) => {
  const { name, email, role } = user; // Destructure user object to get name, email, and role

  return (
    <div className="sidebar">
      <h2>GameTheory</h2>
      
      {/* Bookings Section */}
      <div className="bookings-section">
        <h3 className="section-heading">Bookings</h3>
        <ul>
        {role !== 'MANAGER' && (
          <>
            <li onClick={() => onSelectPage('view')}>View My Bookings</li>
            <li onClick={() => onSelectPage('book')}>Book a Slot</li>
            </>
          )}
          
          {role === 'MANAGER' && (
            <li onClick={() => onSelectPage('schedule')}>Schedule</li>
          )}
        </ul>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        {/* <h3 className="section-heading">Profile</h3> */}
        <h4>{name}</h4>
        <p>{email}</p>
        <p>{role}</p>
      </div>
    </div>
  );
};

export default Sidebar;
