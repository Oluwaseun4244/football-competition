import { useNavigate } from 'react-router-dom';
import { useGetQuery } from '../utils/apiUtils';
interface TableShema {
  id: string;
  name: string;
  matches_played: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goals_difference: number;
  num_of_wins: number;
  num_of_losses: number;
  num_of_draws: number;
}

export default function LeagueTable() {


  const tableQuery = useGetQuery<TableShema[]>(
    {
      url: `table`,
      queryKeys: [`table`],
    },
    {
      queryKey: [`table`],
      refetchOnWindowFocus: true,
      retry: 2
    }
  );


  const navigate = useNavigate();

  const teams = tableQuery.data || [];


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
      {tableQuery.isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading league table...
          </div>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MP</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team, index) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{team.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.matches_played}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.num_of_wins}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.num_of_draws}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.num_of_losses}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goals_for}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goals_against}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goals_difference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
