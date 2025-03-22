import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamDetails from './pages/TeamDetails';
import Login from './pages/Login';
import './App.css';
import TeamList from './pages/TeamList';
import LeagueTable from './pages/LeagueTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teams" element={<TeamList />} />
        <Route path="/league-table" element={<LeagueTable />} />
        <Route path="/team/:teamName" element={<TeamDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
