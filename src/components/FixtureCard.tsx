import React from 'react';
import { Fixture } from '../types/Fixture';

interface FixtureCardProps {
  fixture: Fixture;
  onClick?: () => void;
  onEdit?: (fixture: Fixture) => void;
  isAdmin?: boolean;
}

const FixtureCard: React.FC<FixtureCardProps> = ({ fixture, onClick, onEdit, isAdmin }) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return timeString.substring(0, 5); // Remove seconds if present
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'played':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'played':
        return 'Played';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };



  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fixture.status)}`}>
          {getStatusText(fixture.status)}
        </span>
        <div className="text-sm text-gray-500">
          {formatDate(fixture.date)} • {formatTime(fixture.time)}
        </div>
        {isAdmin && onEdit && fixture.status === 'pending' && (
          <button
            className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            onClick={e => { e.stopPropagation(); onEdit(fixture); }}
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        {/* Home Team */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {fixture.home_team.logo ? (
              <img 
                src={fixture.home_team.logo} 
                alt={fixture.home_team.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-xs font-medium">
                {(fixture.home_team.name ? fixture.home_team.name.substring(0, 2).toUpperCase() : '??')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{fixture.home_team.name}</h3>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center space-x-2 mx-4">
          {fixture.status === 'completed' && fixture.home_team_goals !== undefined && fixture.away_team_goals !== undefined ? (
            <>
              <span className="text-xl font-bold text-gray-900">{fixture.home_team_goals}</span>
              <span className="text-gray-500">-</span>
              <span className="text-xl font-bold text-gray-900">{fixture.away_team_goals}</span>
            </>
          ) : (
            <span className="text-gray-500 font-medium">vs</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <div className="flex-1 text-right">
            <h3 className="font-semibold text-gray-900 text-sm">{fixture.away_team.name}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {fixture.away_team.logo ? (
              <img 
                src={fixture.away_team.logo} 
                alt={fixture.away_team.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-xs font-medium">
                {(fixture.away_team.name ? fixture.away_team.name.substring(0, 2).toUpperCase() : '??')}
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default FixtureCard; 