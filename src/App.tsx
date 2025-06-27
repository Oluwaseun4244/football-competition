import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamDetails from './pages/TeamDetails';
import Login from './pages/Login';
import './App.css';
import TeamList from './pages/TeamList';
import LeagueTable from './pages/LeagueTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ManagTeams from './pages/ManagTeams';
import Fixtures from './pages/Fixtures';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/manage-teams" element={<ManagTeams />} />
          <Route path="/league-table" element={<LeagueTable />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/fixtures" element={<Fixtures />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
