import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../../constants/theme";
import { usePets } from "../../context/PetContext";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={typography.body}>Pet not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={typography.title}>{pet.name}</Text>
      <Text style={typography.caption}>{pet.breed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
});
