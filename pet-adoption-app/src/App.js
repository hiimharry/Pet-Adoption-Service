// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar'; // Your NavBar component
import Register from './screens/register';
import Login from './screens/login';
import AdoptableAnimals from './screens/adoptableAnimals';
import AddAnimal from './screens/animalRegistration';
import AnimalDetail from './screens/individualAnimal';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/animals" element={<AdoptableAnimals />} />
        <Route path="/addanimals" element={<AddAnimal/>}/>
        <Route path="/animals/:animalId" element={<AnimalDetail />} />
        </Routes>
    </Router>
  );
}

export default App;
