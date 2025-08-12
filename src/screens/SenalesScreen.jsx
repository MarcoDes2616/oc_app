import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import ProjectSelectionView from '../components/ProjectSelectionView';
import { useData } from '../context/DataContext';
import SignalsListView from '../components/SignalsListView';

const SenalesScreen = () => {
  const { lists, actions, loading, projects, fetchAdminData, signals } = useData();
  
  // Estados principales
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchSignals();
    }
  }, [selectedProject, filterStatus]);

  const fetchSignals = async () => {
    setRefreshing(true);
    try {
      const params = {
        project_id: selectedProject.id,
        ...(filterStatus && { signal_status_id: filterStatus })
      };
      const response = await actions.signals.getAll(params);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  if (loading && !refreshing) return <ActivityIndicator size="large" />;

  return (
    <>
      {!selectedProject ? (
        <ProjectSelectionView 
          projects={projects}
          lists={lists}
          onSelectProject={setSelectedProject}
        />
      ) : (
        <SignalsListView
          selectedProject={selectedProject}
          signals={signals}
          lists={lists}
          refreshing={refreshing}
          onRefresh={fetchSignals}
          onBack={handleBack}
          hideActions={true}
          setFilterStatus={setFilterStatus}
          filterStatus={filterStatus}
        />
      )}
    </>
  );
};

export default SenalesScreen;