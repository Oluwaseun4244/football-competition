import { useState } from 'react';
import { useGetQuery } from '../utils/apiUtils';
import { Fixture } from '../types/Fixture';
import FixtureCard from '../components/FixtureCard';
import CreateFixtureModal from '../components/CreateFixtureModal';
import Button from '../components/ui/Button';
import useProfile from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';

type TabType = 'unplayed' | 'all' | 'played';

export default function Fixtures() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { userProfile } = useProfile();
  const [editFixture, setEditFixture] = useState<Fixture | null>(null);
  const navigate = useNavigate();

  // You'll need to replace 'competition-id' with the actual competition ID
  const competitionId = '1'; // This should come from your app context or props

  const { data: pendingFixtures, isLoading: pendingFixturesLoading, error: pendingFixturesError } = useGetQuery<Fixture[]>({
    url: 'pending-fixtures',
    queryKeys: ['pending-fixtures']
  });
  const { data: completedFixtures, isLoading: completedFixturesLoading, error: completedFixturesError } = useGetQuery<Fixture[]>({
    url: 'completed-fixtures',
    queryKeys: ['completed-fixtures']
  });

  const { data: allFixtures, isLoading: allFixturesLoading, error: allFixturesError } = useGetQuery<Fixture[]>({
    url: 'all-fixtures',
    queryKeys: ['all-fixtures']
  });

  const isAdmin = userProfile?.type === 'admin';

  let filteredFixtures: Fixture[] = [];
  if (activeTab === 'unplayed') {
    filteredFixtures = pendingFixtures || [];
  } else if (activeTab === 'played') {
    filteredFixtures = completedFixtures || [];
  } else {
    filteredFixtures = allFixtures || [];
  }

  const tabs = [
    { id: 'unplayed' as TabType, label: 'Unplayed', count: pendingFixtures?.filter(f => f.status === 'pending').length || 0 },
    { id: 'all' as TabType, label: 'All', count: allFixtures?.length || 0 },
    { id: 'played' as TabType, label: 'Played', count: completedFixtures?.filter(f => f.status === 'completed').length || 0 }
  ];

  const handleFixtureClick = (fixture: Fixture) => {
    // Handle fixture click - could open details modal or navigate to fixture page
    console.log('Fixture clicked:', fixture);
  };

  const handleEdit = (fixture: Fixture) => {
    setEditFixture(fixture);
  };

  if (pendingFixturesError || completedFixturesError || allFixturesError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading fixtures
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {pendingFixturesError?.response?.data?.message || completedFixturesError?.response?.data?.message || allFixturesError?.response?.data?.message || 'Failed to load fixtures. Please try again.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm"
      >
        ← Back
      </button>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fixtures</h1>
            <p className="mt-2 text-gray-600">
              View and manage all match fixtures
            </p>
          </div>
          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <Button
                text="Create Fixture"
                onClick={() => setIsCreateModalOpen(true)}
                bg="bg-blue-600"
                classNames="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-900'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {pendingFixturesLoading || completedFixturesLoading || allFixturesLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading fixtures...
              </div>
            </div>
          ) : filteredFixtures.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fixtures found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all'
                  ? 'No fixtures have been created yet.'
                  : `No ${activeTab} fixtures found.`
                }
              </p>
              {isAdmin && activeTab === 'all' && (
                <div className="mt-6">
                  <Button
                    text="Create First Fixture"
                    onClick={() => setIsCreateModalOpen(true)}
                    bg="bg-blue-600"
                    classNames="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    onClick={() => handleFixtureClick(fixture)}
                    onEdit={handleEdit}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Fixture Modal */}
      <CreateFixtureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        competitionId={competitionId}
      />
      {/* Edit Fixture Modal */}
      {editFixture && (
        <CreateFixtureModal
          isOpen={!!editFixture}
          onClose={() => setEditFixture(null)}
          competitionId={competitionId}
          initialData={editFixture}
          isEdit
        />
      )}
      {/* Confirmation modal removed in favor of JS prompt for edit */}
    </div>
  );
}