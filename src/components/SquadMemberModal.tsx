import React, { useState } from 'react';
import { usePostQueryWithFile } from '../utils/apiUtils';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
interface SquadMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCoach?: boolean;
  teamId: string;
}

const SquadMemberModal: React.FC<SquadMemberModalProps> = ({
  isOpen,
  onClose,
  isCoach = false,
  teamId
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = usePostQueryWithFile('create-squad-member', {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [`team-${teamId}`] });
      setName('');
      setPosition('');
      setFile(null);
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
    if (!file) {
      alert('Please upload an image');
      return;
    };

    if (!allowOnlyImage(file)) {
      alert('Please upload a valid image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('team_id', teamId);
    formData.append('role_name', isCoach ? 'coach' : 'player');
    formData.append('image', file);

    mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isCoach ? 'Add New Coach' : 'Add New Squad Member'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Position</option>
              {
                isCoach ? (
                  <option value="coach">Coach</option>
                ) : (
                  <>
                    <option value="defender">Defender</option>
                    <option value="midfield">Midfielder</option>
                    <option value="attacker">Attacker</option>
                  </>
                )
              }
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="file"
              id="imageUrl"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFile(file);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>

            <Button
              text="Add Member"
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

export default SquadMemberModal; 