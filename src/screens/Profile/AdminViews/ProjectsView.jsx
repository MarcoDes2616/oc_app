// AdminViews/ProjectsView.jsx
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

const ProjectsView = ({ data, loading, error }) => {
  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error}</Text>;
  if (!data?.length) return <Text>No hay proyectos</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.status}</Text>
        </View>
      )}
    />
  );
};

export default ProjectsView;