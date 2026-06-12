import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../constants/theme";

export default function AddEntryScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.title}>Add entry</Text>
      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={[typography.bodyMedium, { color: colors.textOnAccent }]}>
          Close
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  closeButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
});
