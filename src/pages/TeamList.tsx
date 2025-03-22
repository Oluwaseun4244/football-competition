import TeamCard from "../components/TeamCard";
import TeamModal from "../components/TeamModal";
import { useState } from "react";

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

export default function TeamList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState(dummyTeams);

  const handleCreateTeam = (teamData: { teamName: string; coachName: string }) => {
    const newTeam: Team = {
      ...teamData,
      id: (teams.length + 1).toString(),
      points: 0,
      matchesPlayed: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };
    const newTeams = [...teams, newTeam].sort((a, b) =>
      a.teamName.localeCompare(b.teamName)
    );
    setTeams(newTeams);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Football Competition</h1>
        </div>



        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-8"
        >
          Create Team
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <TeamCard
              key={index}
              teamName={team.teamName}
              coachName={team.coachName}
              id={team.id}
            />
          ))}
        </div>

        <TeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTeam}
        />
      </div>
    </div>
  );
}