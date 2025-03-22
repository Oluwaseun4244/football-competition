import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamCardProps {
  teamName: string;
  coachName: string;
  id: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName, coachName, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/team/${encodeURIComponent(id)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{teamName}</h2>
      <p className="text-gray-600">Coach: {coachName}</p>
    </div>
  );
};

export default TeamCard; 