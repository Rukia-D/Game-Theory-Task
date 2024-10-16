// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import ViewBookings from './components/ViewBookings';
// import BookSlot from './components/BookSlot';
// import './App.css';

// function App() {
//   const [selectedPage, setSelectedPage] = useState('view');

//   return (
//     <div className="app">
//       <Sidebar onSelectPage={setSelectedPage} />
//       <div className="content">
//         {selectedPage === 'view' ? <ViewBookings /> : <BookSlot />}
//       </div>
//     </div>
//   );
// }

// export default App;


//hardcore
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ViewBookings from './components/ViewBookings';
import BookSlot from './components/BookSlot';
import './App.css';

function App() {
  const [selectedPage, setSelectedPage] = useState('view');

  return (
    <div className="app">
      <Sidebar onSelectPage={setSelectedPage} />
      <div className="content">
        {selectedPage === 'view' ?  <ViewBookings /> : <BookSlot />}
        
      </div>
    </div>
  );
}

export default App;

