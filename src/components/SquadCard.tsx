import React from 'react';

interface SquadCardProps {
  name?: string;
  serialNumber?: number;
  imageUrl?: string;
  isCoach?: boolean;
  onClick: () => void;
}

const SquadCard: React.FC<SquadCardProps> = ({ 
  name, 
  serialNumber, 
  imageUrl, 
  isCoach = false,
  onClick,
}) => {
  const isAddCard = !name || !imageUrl;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      <div className="aspect-square relative mb-3">
        {isAddCard ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
      {!isAddCard && (
        <>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">
            {isCoach ? 'Coach' : `#${serialNumber}`}
          </p>
        </>
      )}
    </div>
  );
};

export default SquadCard; 