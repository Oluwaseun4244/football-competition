import { useNavigate } from 'react-router-dom';
import { useGetQuery, usePostQuery } from '../utils/apiUtils';
import { Team } from '../types/Team';
import { useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import DropdownMenu from '../components/DropdownMenu';
import moment from 'moment';

export default function ManagTeams() {

  const [isReOpenModalOpen, setIsReOpenModalOpen] = useState(false);

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

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard');
  }

  const { mutate: confirmTeam, isPending } = usePostQuery('teams/confirm', {
    onSuccess: (data: any) => {
      setIsConfirmModalOpen(false);
      setIsReOpenModalOpen(false);
      setIsRejectModalOpen(false);
      alert('Team confirmed successfully');
      teamsQuery.refetch();
    },
    onError: (error) => {
      // console.log(error);
      alert(error.response.data.message);
    },
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const handleConfirm = (teamId: number) => {
    setSelectedTeamId(teamId);
    setIsConfirmModalOpen(true);
  }

  const handleReject = (teamId: number) => {
    setSelectedTeamId(teamId);
    setIsRejectModalOpen(true);
  }

  const handleReOpen = (teamId: number) => {
    setSelectedTeamId(teamId);
    setIsReOpenModalOpen(true);
  }

  const handleConfirmSubmit = () => {
    if (selectedTeamId) {
      confirmTeam({ teamId: selectedTeamId, submission_status: 'approved' });
      setSelectedTeamId(null);
    }
  }

  const handleRejectSubmit = () => {
    if (selectedTeamId) {
      confirmTeam({ teamId: selectedTeamId, submission_status: 'rejected' });
      setSelectedTeamId(null);
    }
  }

  const handleReOpenSubmit = () => {
    if (selectedTeamId) {
      confirmTeam({ teamId: selectedTeamId, submission_status: 'opened' });
      setSelectedTeamId(null);
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-8" >
          <h2 className="text-2xl font-semibold text-gray-900">Manage Teams</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy Password</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team, index) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.coaches.map((coach) => coach.name).join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{moment(team.created_at).format('MMM Do YY')}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm capitalize ${team.submission_status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{team.submission_status || '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                    <button
                      onClick={() => handleCopyPassword(team.coach_admin.plain_password)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Copy Password
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <DropdownMenu
                      onConfirm={() => handleConfirm(team.id)}
                      onReject={() => handleReject(team.id)}
                      onReOpen={() => handleReOpen(team.id)}
                      isPending={isPending}
                      isApproved={team.submission_status === 'approved'}
                      teamId={team.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isReOpenModalOpen}
        onClose={() => {
          setIsReOpenModalOpen(false);
          setSelectedTeamId(null);
        }}
        onConfirm={handleReOpenSubmit}
        title="Reopen Team"
        message="Are you sure you want to reopen this team?"
        isLoading={isPending}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedTeamId(null);
        }}
        onConfirm={handleConfirmSubmit}
        title="Confirm Team"
        message="Are you sure you want to confirm this team?"
        isLoading={isPending}
      />

      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedTeamId(null);
        }}
        onConfirm={handleRejectSubmit}
        title="Reject Team"
        message="Are you sure you want to reject this team?"
        isLoading={isPending}
      />
    </>
  )
}
