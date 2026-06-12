import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../constants/theme";

export default function PetsScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.title}>Pets</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
});
