import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaView = ({ 
  children, 
  style, 
}) => {
  const insets = useSafeAreaInsets();
  const safeArea = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <View style={[style, safeArea]}>
      {children}
    </View>
  );
};
