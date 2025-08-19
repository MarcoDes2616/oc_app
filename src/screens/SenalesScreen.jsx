import { useState, useEffect } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { useData } from "../context/DataContext";
import SignalsListView from "../components/SignalsListView";
import { IconButton } from "react-native-paper";

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
      await actions.instruments.getAll();
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

  if (loading && !refreshing) return <ActivityIndicator size="large" />;

  return (
    <>
      {selectedProject ? (
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
      ) : (
        <View>
          <IconButton
            icon="refresh"
            size={24}
            style={styles.resetIcon}
            onPress={initialFetch}
            disabled={loading}
            accessibilityLabel="Reiniciar proceso de login"
          />
          <Text>Aun no tenemos señales para mostrar!</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  resetIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default SenalesScreen;
