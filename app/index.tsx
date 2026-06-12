import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../constants/theme";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={typography.display}>PetDiary</Text>
      <Text style={[typography.body, { color: colors.textMuted }]}>
        A little journal for your pets.
      </Text>

      <View style={styles.card}>
        <Text style={typography.heading}>Poppins heading</Text>
        <Text style={typography.body}>Inter body text — used everywhere.</Text>
        <Text style={typography.caption}>Inter caption, muted</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
