import React from 'react';

interface SquadMemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    name: string;
    position: string;
    imageUrl: string;
    serialNumber?: number;
  };
  isCoach?: boolean;
}

const SquadMemberDetailsModal: React.FC<SquadMemberDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  member,
  isCoach = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Member Details</h2>
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
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Name</h3>
            <p className="text-gray-600">{member.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Position</h3>
            <p className="text-gray-600">{member.position}</p>
          </div>
          {!isCoach && member.serialNumber && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Squad Number</h3>
              <p className="text-gray-600">#{member.serialNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SquadMemberDetailsModal; 