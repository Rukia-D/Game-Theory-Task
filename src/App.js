// App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ViewBookings from './components/ViewBookings';
import BookSlot from './components/BookSlot';
import Schedule from './components/Schedule'; // Import the Schedule component
import './App.css';

// Dummy user data for demonstration; replace with actual user data from your auth context or state
const userData = {
  name1: 'Devangi',
  email: 'DevangiGajjar@gmail.com',
  role: process.env.REACT_APP_USER_ROLE
};

function App() {
  const [selectedPage, setSelectedPage] = useState('view');

  return (
    <div className="app">
      <Sidebar onSelectPage={setSelectedPage} user={userData} /> {/* Pass user data */}
      <div className="content">
        {selectedPage === 'view' && <ViewBookings />}
        {selectedPage === 'book' && <BookSlot />}
        {selectedPage === 'schedule' && <Schedule />} {/* Render Schedule component */}
      </div>
    </div>
  );
}

export default App;
