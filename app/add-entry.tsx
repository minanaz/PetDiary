import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../constants/theme";
import { usePets } from "../context/PetContext";
import { ACTIVITY_LABELS, type ActivityType } from "../types/activity";

const ACTIVITY_TYPES: ActivityType[] = ["meal", "walk", "med", "vet", "play"];

export default function AddEntryScreen() {
  const { pets, addActivity } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    pets[0]?.id ?? null,
  );
  const [selectedType, setSelectedType] = useState<ActivityType>("meal");

  const handleSave = () => {
    if (!selectedPetId) return;

    addActivity({
      id: Date.now().toString(),
      petId: selectedPetId,
      type: selectedType,
      date: new Date().toISOString(),
    });
    router.back();
  };

  if (pets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={typography.body}>
          Add a pet first! Go to the Pets tab.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={typography.title}>Add entry</Text>

      <Text style={typography.label}>PET</Text>
      <View style={styles.row}>
        {pets.map((pet) => (
          <Pressable
            key={pet.id}
            onPress={() => setSelectedPetId(pet.id)}
            style={[
              styles.chip,
              selectedPetId === pet.id && styles.chipSelected,
            ]}
          >
            <Text
              style={
                selectedPetId === pet.id
                  ? styles.chipTextSelected
                  : styles.chipText
              }
            >
              {pet.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={typography.label}>TYPE</Text>
      <View style={styles.row}>
        {ACTIVITY_TYPES.map((type) => (
          <Pressable
            key={type}
            onPress={() => setSelectedType(type)}
            style={[styles.chip, selectedType === type && styles.chipSelected]}
          >
            <Text
              style={
                selectedType === type
                  ? styles.chipTextSelected
                  : styles.chipText
              }
            >
              {ACTIVITY_LABELS[type]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={[typography.bodyMedium, { color: colors.textOnAccent }]}>
          Save
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontFamily: typography.body.fontFamily, color: colors.text },
  chipTextSelected: {
    fontFamily: typography.body.fontFamily,
    color: colors.textOnPrimary,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
});
