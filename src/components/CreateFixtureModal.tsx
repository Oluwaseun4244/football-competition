import React, { useState, useEffect } from 'react';
import { useGetQuery, usePostQuery } from '../utils/apiUtils';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
import { CreateFixtureData, Fixture } from '../types/Fixture';

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface CreateFixtureModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
  initialData?: Partial<Fixture>;
  isEdit?: boolean;
  isEditing?: boolean;
}

const CreateFixtureModal: React.FC<CreateFixtureModalProps> = ({
  isOpen,
  onClose,
  competitionId,
  initialData,
  isEdit = false,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    home_team_id: 0,
    away_team_id: 0,
    date: '',
    time: '',
    competition_id: competitionId,
    home_team_goals: '',
    away_team_goals: '',
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        home_team_id: Number(initialData.home_team?.id) || 0,
        away_team_id: Number(initialData.away_team?.id) || 0,
        date: initialData.date || '',
        time: initialData.time || '',
        competition_id: competitionId,
        home_team_goals: typeof initialData.home_team_goals !== 'undefined' ? initialData.home_team_goals : '',
        away_team_goals: typeof initialData.away_team_goals !== 'undefined' ? initialData.away_team_goals : '',
      });
    } else {
      setFormData({
        home_team_id: 0,
        away_team_id: 0,
        date: '',
        time: '',
        competition_id: competitionId,
        home_team_goals: '',
        away_team_goals: '',
      });
    }
  }, [isEdit, initialData, competitionId, isOpen]);

  const queryClient = useQueryClient();

  const { data: teams, isLoading: teamsLoading } = useGetQuery<Team[]>({
    url: 'teams',
    queryKeys: ['teams']
  });

  const { mutate: createFixtureMutate, isPending: isCreating } = usePostQuery<{ message: string }, CreateFixtureData>('create-fixture', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['completed-fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['all-fixtures'] });
      onClose();
      setFormData({
        home_team_id: 0,
        away_team_id: 0,
        date: '',
        time: '',
        competition_id: competitionId,
        home_team_goals: '',
        away_team_goals: '',
      });
    },
    onError: (error) => {
      console.error('Error creating fixture:', error);
      alert(error.response?.data?.message || 'Failed to create fixture');
    }
  });
  const { mutate: updateFixtureMutate, isPending: isUpdating } = usePostQuery<{ message: string }, CreateFixtureData>(`update-fixture/${initialData?.id}`, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['completed-fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['all-fixtures'] });
      onClose();
      setFormData({
        home_team_id: 0,
        away_team_id: 0,
        date: '',
        time: '',
        competition_id: competitionId,
        home_team_goals: '',
        away_team_goals: '',
      });
    },
    onError: (error) => {
      console.error('Error creating fixture:', error);
      alert(error.response?.data?.message || 'Failed to create fixture');
    }
  });

  const handleEditSubmit = (updatedData: any) => {
    const confirmed = window.confirm('Are you sure you want to update this fixture?');
    if (confirmed) {
      handleConfirmUpdate(updatedData);
    }
  };


  const handleConfirmUpdate = (data?: any) => {
    if (!initialData && !data) return;
    const payload = { ...(data || initialData) };
    if (
      typeof payload.home_team_goals !== 'undefined' &&
      typeof payload.away_team_goals !== 'undefined'
    ) {
      payload.status = 'completed';
    }
    updateFixtureMutate(payload);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.home_team_id === formData.away_team_id) {
      alert('Home team and away team cannot be the same');
      return;
    }

    if (!formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEdit) {
      handleEditSubmit(formData as CreateFixtureData);
    } else {
      createFixtureMutate(formData as CreateFixtureData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Fixture' : 'Create New Fixture'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Team *
            </label>
            <select
              value={formData.home_team_id}
              onChange={(e) => handleInputChange('home_team_id', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Select Home Team</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Away Team *
            </label>
            <select
              value={formData.away_team_id}
              onChange={(e) => handleInputChange('away_team_id', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Select Away Team</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Match Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={today}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Match Time *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="07:00"
              max="17:00"
            />
          </div>

          {isEdit && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Score</label>
                <input
                  type="number"
                  min={0}
                  value={formData.home_team_goals}
                  onChange={e => handleInputChange('home_team_goals', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Away Score</label>
                <input
                  type="number"
                  min={0}
                  value={formData.away_team_goals}
                  onChange={e => handleInputChange('away_team_goals', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <Button
              text={isEdit ? 'Update Fixture' : 'Create Fixture'}
              isLoading={isUpdating || isCreating || teamsLoading || isEditing}
              disabled={isUpdating || isCreating || teamsLoading || isEditing}
              type="submit"
              bg="bg-blue-600"
              classNames="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFixtureModal; 