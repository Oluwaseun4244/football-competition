import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SquadCard from '../components/SquadCard';
import SquadMemberModal from '../components/SquadMemberModal';
import SquadMemberDetailsModal from '../components/SquadMemberDetailsModal';
import { useNavigate } from 'react-router-dom';
import { useGetQuery } from '../utils/apiUtils';
import { Team, SquadMember } from '../types/Team';
import useProfile from '../hooks/useProfile';

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: team } = useGetQuery<Team>({
    url: `team/${id}`,
    queryKeys: [`team-${id}`],
  });

  const { userProfile } = useProfile();

  const players = team?.players || [];
  const coaches = team?.coaches || [];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SquadMember | null>(null);
  const [isAddingCoach, setIsAddingCoach] = useState(false);


  const navigate = useNavigate();
  const handleCardClick = (member?: SquadMember, isCoach?: boolean, action?: 'view' | 'add') => {
    const isAdmin = userProfile?.type === 'admin';

    const isTeamAdmin = userProfile?.type === 'team_admin';

    const isMyTeam = userProfile?.team_id === id;
    const iHaveAccess = isMyTeam && isTeamAdmin;

    if (iHaveAccess || isAdmin || action === 'view') {

      if (member) {
        setSelectedMember(member);
        setIsDetailsModalOpen(true);
      } else {
        setIsAddingCoach(isCoach || false);
        setIsAddModalOpen(true);
      }
    } else {
      alert('You are not authorized to add or edit squad members');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{team?.name}</h1>
          <p className="text-lg text-gray-600">Squad Management</p>
        </div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => navigate('/teams')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-8"
          >
            Back to Teams
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Coaching Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              team?.coaches?.map((coach) => (
                <SquadCard
                  key={coach.id}
                  name={coach.name}
                  image_url={coach.image_url}
                  is_coach={true}
                  onClick={() => handleCardClick(coach, true, 'view')}
                />
              ))
            }
            {
              coaches.length < 2 && (
                <SquadCard
                  name=""
                  image_url=""
                  is_coach={true}
                  onClick={() => handleCardClick(undefined, true, 'add')}
                />
              )
            }
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Squad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team?.players?.map((member) => (
              <SquadCard
                key={member.id}
                {...member}
                is_coach={member.position === 'coach'}
                onClick={() => handleCardClick(member, false, 'view')}
              />
            ))}
            {
              players.length < 15 && (
                <SquadCard
                  name=""
                  is_coach={false}
                  image_url=""
                  onClick={() => handleCardClick(undefined, false, 'add')}
                />
              )
            }
          </div>
        </div>

        <SquadMemberModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsAddingCoach(false);
          }}
          isCoach={isAddingCoach}
          teamId={id || ''}
        />

        {selectedMember && (
          <SquadMemberDetailsModal
            isOpen={isDetailsModalOpen}
            teamId={id || ''}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedMember(null);
            }}
            member={selectedMember}
            isCoach={selectedMember.role_name === 'coach'}
          />
        )}
      </div>
    </div>
  );
};

export default TeamDetails; 