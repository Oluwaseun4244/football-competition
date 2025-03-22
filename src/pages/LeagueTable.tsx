import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
interface Team {
  teamName: string;
  coachName: string;
  id: string;
  points: number;
  matchesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
}
const dummyTeams: Team[] = [
  { teamName: 'Arsenal', coachName: 'Mikel Arteta', id: "1", points: 0, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0 },
  { teamName: 'Chelsea', coachName: 'Mauricio Pochettino', id: "2", points: 0, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0 },
  { teamName: 'Liverpool', coachName: 'Jürgen Klopp', id: "3", points: 0, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0 },
  { teamName: 'Manchester City', coachName: 'Pep Guardiola', id: "4", points: 0, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0 },
  { teamName: 'Manchester United', coachName: 'Erik ten Hag', id: "5", points: 0, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0 },
];
export default function LeagueTable() {

  const navigate = useNavigate();
  const [teams, setTeams] = useState(dummyTeams);

  const sortedTeams = [...teams].sort((a, b) => {
    if (a.points === 0 && b.points === 0) {
      return a.teamName.localeCompare(b.teamName);
    }
    if (a.points !== b.points) {
      return b.points - a.points;
    }
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });


  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-8" >

        <h2 className="text-2xl font-semibold text-gray-900">League Table</h2>
        <button
          onClick={() => navigate('/teams')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Teams
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MP</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.teamName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.matchesPlayed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsFor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsAgainst}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsFor - team.goalsAgainst}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
