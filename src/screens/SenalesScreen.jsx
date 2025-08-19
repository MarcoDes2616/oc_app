import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useData } from "../context/DataContext";
import SignalsListView from "../components/SignalsListView";

const SenalesScreen = () => {
  const { lists, actions, loading, projects, signals } = useData();

  // Estados principales
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    initialFetch();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchSignals();
    }
  }, [selectedProject, filterStatus]);

  const initialFetch = async () => {
    setRefreshing(true);
    try {
      const result = await actions.projects.getAll(true);
      if (result.length > 0) {
        setSelectedProject(result[0]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchSignals = async () => {
    setRefreshing(true);
    try {
      const params = {
        project_id: selectedProject.id,
        ...(filterStatus && { signal_status_id: filterStatus }),
      };
      await actions.signals.getAll(params);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if ((loading && !refreshing) || !selectedProject) return <ActivityIndicator size="large" />;

  return (
    <>
    {
      selectedProject &&
      <SignalsListView
        selectedProject={selectedProject}
        signals={signals}
        lists={lists}
        refreshing={refreshing}
        onRefresh={fetchSignals}
        hideActions={true}
        setFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        />
    }
    </>
  );
};

export default SenalesScreen;
