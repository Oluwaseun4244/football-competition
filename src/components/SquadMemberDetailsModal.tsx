import React, { useState } from 'react';
import { SquadMember } from '../types/Team';
import { usePostQueryWithFile, usePutQuery } from '../utils/apiUtils';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
import useProfile from '../hooks/useProfile';
interface SquadMemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: SquadMember;
  isCoach?: boolean;
  teamId: string;
}

const SquadMemberDetailsModal: React.FC<SquadMemberDetailsModalProps> = ({
  isOpen,
  onClose,
  member,
  isCoach = false,
  teamId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(member);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { userProfile } = useProfile();

  const { mutate, isPending } = usePostQueryWithFile(`update-squad-member/${member.id}`, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`team-${teamId}`] });
      setIsEditing(false);
      onClose();
    },
    onError: (error) => {
      console.log(error);
      alert(error.response.data.message);
    },
  });
  const allowOnlyImage = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editedMember.name);
    formData.append('position', editedMember.position);
    if (file) {
      if (!allowOnlyImage(file)) {
        alert('Please upload a valid image');
        return;
      }
      formData.append('image', file);
    }
    mutate(formData);
  };

  const isAdmin = userProfile?.type === 'admin';

  const isTeamAdmin = userProfile?.type === 'team_admin';
  const isMyTeam = userProfile?.team_id === teamId;
  const iHaveAccess = isMyTeam && isTeamAdmin;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Member Details</h2>
            {!isEditing && (iHaveAccess || isAdmin) && (
              <button
                onClick={() => setIsEditing(true)}
                className="hover:text-blue-600 w-10 bg-blue-500 text-white rounded-md"
              >
                Edit
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="aspect-square w-full mb-4">
          <img
            src={editedMember.image_url}
            alt={editedMember.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editedMember.name}
                onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={editedMember.position}
                onChange={(e) => setEditedMember({ ...editedMember, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {isCoach ? (
                  <option value="coach">Coach</option>
                ) : (
                  <>
                    <option value="defender">Defender</option>
                    <option value="midfield">Midfielder</option>
                    <option value="attacker">Attacker</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Image</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFile(file);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <Button
                text="Save Changes"
                isLoading={isPending}
                disabled={isPending}
                type="submit"
                bg="bg-blue-600"
                classNames="w-[120px] h-[40px] px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Name</h3>
              <p className="text-gray-600">{member.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Position</h3>
              <p className="text-gray-600">{member.position}</p>
            </div>
            {!isCoach && member.number && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Squad Number</h3>
                <p className="text-gray-600">#{member.number}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SquadMemberDetailsModal; 