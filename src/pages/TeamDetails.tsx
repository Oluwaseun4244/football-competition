import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SquadCard from '../components/SquadCard';
import SquadMemberModal from '../components/SquadMemberModal';
import SquadMemberDetailsModal from '../components/SquadMemberDetailsModal';



interface SquadMember {
  name: string;
  position: string;
  imageUrl: string;
  serialNumber?: number;
}

const TeamDetails: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [squad] = useState([
    { name: 'Mikel Arteta', position: 'Head Coach', imageUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQCed4E9oL5kysgeJRyIohwMdiTiUQSp61AahI8EnO_G79s-bdmmFotRifeeMs5L_AsOPvXloGjUqVQaoK8OCw-hQ', serialNumber: 1 },
    { name: 'Aaron Ramsdale', position: 'Goalkeeper', imageUrl: 'https://example.com/ramsdale.jpg', serialNumber: 1 },
    { name: 'Ben White', position: 'Defender', imageUrl: 'https://example.com/white.jpg', serialNumber: 4 },
    { name: 'William Saliba', position: 'Defender', imageUrl: 'https://example.com/saliba.jpg', serialNumber: 2 },
    { name: 'Gabriel', position: 'Defender', imageUrl: 'https://example.com/gabriel.jpg', serialNumber: 6 },
    { name: 'Oleksandr Zinchenko', position: 'Defender', imageUrl: 'https://example.com/zinchenko.jpg', serialNumber: 35 },
    { name: 'Martin Ødegaard', position: 'Midfielder', imageUrl: 'https://example.com/odegaard.jpg', serialNumber: 8 },
    { name: 'Declan Rice', position: 'Midfielder', imageUrl: 'https://example.com/rice.jpg', serialNumber: 41 },
    { name: 'Kai Havertz', position: 'Midfielder', imageUrl: 'https://example.com/havertz.jpg', serialNumber: 29 },
    { name: 'Bukayo Saka', position: 'Forward', imageUrl: 'https://example.com/saka.jpg', serialNumber: 7 },
    { name: 'Gabriel Jesus', position: 'Forward', imageUrl: 'https://example.com/jesus.jpg', serialNumber: 9 },
    { name: 'Gabriel Martinelli', position: 'Forward', imageUrl: 'https://example.com/martinelli.jpg', serialNumber: 11 },
    { name: 'Leandro Trossard', position: 'Forward', imageUrl: 'https://example.com/trossard.jpg', serialNumber: 19 },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SquadMember | null>(null);
  const [isAddingCoach, setIsAddingCoach] = useState(false);

  const handleAddSquadMember = () => {
    console.log('Adding new squad member');
  };

  const handleCardClick = (member?: SquadMember, isCoach?: boolean) => {
    if (member) {
      setSelectedMember(member);
      setIsDetailsModalOpen(true);
    } else {
      setIsAddingCoach(isCoach || false);
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{teamName}</h1>
          <p className="text-lg text-gray-600">Squad Management</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Coaching Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SquadCard
              name={squad[0].name}
              imageUrl={squad[0].imageUrl}
              isCoach={true}
              onClick={() => handleCardClick(squad[0], true)}
            />
            <SquadCard
              name=""
              imageUrl=""
              isCoach={true}
              onClick={() => handleCardClick(undefined, true)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Squad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {squad.slice(1).map((member, index) => (
              <SquadCard
                key={index}
                name={member.name}
                imageUrl={member.imageUrl}
                serialNumber={member.serialNumber}
                onClick={() => handleCardClick(member)}
              />
            ))}
            <SquadCard
              name=""
              imageUrl=""
              onClick={() => handleCardClick()}
            />
          </div>
        </div>

        <SquadMemberModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsAddingCoach(false);
          }}
          onSubmit={handleAddSquadMember}
          isCoach={isAddingCoach}
        />

        {selectedMember && (
          <SquadMemberDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedMember(null);
            }}
            member={selectedMember}
            isCoach={!selectedMember.serialNumber}
          />
        )}
      </div>
    </div>
  );
};

export default TeamDetails; 