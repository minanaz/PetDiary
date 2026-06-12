import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../constants/theme";

export default function LogScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.title}>Log</Text>
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
