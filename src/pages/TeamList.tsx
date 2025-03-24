import TeamCard from "../components/TeamCard";
import TeamModal from "../components/TeamModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetQuery } from "../utils/apiUtils";
import useProfile from "../hooks/useProfile";
type squad_member = {
  name: string;
  position: string;
  number: number;
  id: string;
}
interface Team {
  id: string;
  name: string;
  slug: string;
  coachName: string;
  squad_members: squad_member[]
}



export default function TeamList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const teamsQuery = useGetQuery<Team[]>(
    {
      url: `teams`,
      queryKeys: [`teams`],
    },
    {
      queryKey: [`teams`],
      refetchOnWindowFocus: true,
      retry: 2
    }
  );

  const teams = teamsQuery.data || [];

  const { userProfile } = useProfile();



  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Football Competition</h1>
        </div>


        <div className="flex justify-between items-center">
          {
            userProfile?.type === 'admin' ?
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-8"
              >
                Create Team
              </button> : <></>
          }
          <button
            onClick={() => navigate('/league-table')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-8"
          >
            View League Table
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <TeamCard
              key={index}
              teamName={team.name}
              coachName={team.squad_members?.find(member => member.position === 'coach')?.name || ''}
              id={team.id}
            />
          ))}
        </div>

        <TeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}