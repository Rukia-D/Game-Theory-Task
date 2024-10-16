import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ViewBookings from './components/ViewBookings';
import BookSlot from './components/BookSlot';
import Schedule from './components/Schedule'; // Import the Schedule component
import './App.css';

function App() {
  const [selectedPage, setSelectedPage] = useState('view');

  return (
    <div className="app">
      <Sidebar onSelectPage={setSelectedPage} />
      <div className="content">
        {selectedPage === 'view' && <ViewBookings />}
        {selectedPage === 'book' && <BookSlot />}
        {selectedPage === 'schedule' && <Schedule />} 
      </div>
    </div>
  );
}

export default App;
