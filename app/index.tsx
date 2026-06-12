import { ScrollView, StyleSheet, Text, View } from "react-native";

import { usePets } from "@/context/PetContext";
import { colors, radius, spacing, typography } from "../constants/theme";

export default function Index() {
  const { pets, addPet, isLoading } = usePets();

  if (isLoading) {
    return <Text style={typography.body}>Loading...</Text>;
  }

  const addTestPet = () => {
    addPet({
      id: Date.now().toString(),
      name: "Biscuit",
      breed: "Beagle",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={typography.display}>PetDiary</Text>
      <Text style={[typography.body, { color: colors.textMuted }]}>
        A little journal for your pets.
      </Text>

      <View style={styles.card}>
        <Text style={typography.heading}>Pets in context: {pets.length}</Text>
        <Text style={typography.body} onPress={addTestPet}>
          Tap here to add a test pet
        </Text>
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
