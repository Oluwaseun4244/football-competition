import TeamCard from "../components/TeamCard";
import TeamModal from "../components/TeamModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetQuery } from "../utils/apiUtils";
import useProfile from "../hooks/useProfile";
import Loader from "../components/ui/Loader";

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

  const hadleLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Football Competition</h1>
          <button
            onClick={hadleLogout}
            className="bg-blue-600 h-[30px] text-white px-6  rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 lg:mb-0"
          >
            Logout
          </button>
        </div>


        <div className="flex flex-col lg:flex-row justify-between mb-8">
          {
            userProfile?.type === 'admin' &&
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white  px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 lg:mb-0"
            >
              Create Team
            </button>

          }
          {
            userProfile?.type === 'admin' &&
            <button
              onClick={() => navigate('/manage-teams')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 lg:mb-0"
            >
              Manage Teams
            </button>
          }

          <button
            onClick={() => navigate('/fixtures')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 lg:mb-0"
          >
            Fixtures
          </button>
          <button
            onClick={() => navigate('/league-table')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 lg:mb-0"
          >
            View League Table
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsQuery.isLoading ? <Loader text="Loading teams..." /> : teams.map((team, index) => (
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