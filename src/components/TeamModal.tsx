import React, { useState } from 'react';
import { usePostQuery } from '../utils/apiUtils';
import Button from './ui/Button';
import { useQueryClient } from '@tanstack/react-query';


interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose }) => {
  const [teamName, setTeamName] = useState('');
  const [coachName, setCoachName] = useState('');

  const queryClient = useQueryClient();


  const { mutate, isPending } = usePostQuery('create-team', {
    onSuccess: (data: any) => {
      // console.log("data", data)
      setTeamName('');
      setCoachName('');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      onClose();
    },
    onError: (error) => {
      console.log(error);
      alert(error.response.data.message);
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim() === '' || coachName.trim() === '') {
      alert('Team name and coach name are required');
      return;
    }
    if (teamName.trim().length < 3 || coachName.trim().length < 3) {
      alert('Team name and coach name must be at least 3 characters');
      return;
    }
    mutate({ name: teamName, full_name: coachName });

  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register New Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-1">
              Coach Name
            </label>
            <input
              type="text"
              id="full_name"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="coach">Coach</option>
              <option value="player">Player</option>
            </select>
          </div> */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <Button
              text="Create Team"
              isLoading={isPending}
              disabled={isPending}
              type="submit"
              bg="bg-blue-600"
              classNames="w-[120px] h-[40px] px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"

            />

          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal; 