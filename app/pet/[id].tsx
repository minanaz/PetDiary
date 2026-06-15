import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { ActivityCard } from "../../components/ActivityCard";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { usePets } from "../../context/PetContext";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, activities, deletePet, deleteActivity } = usePets();
  const pet = pets.find((p) => p.id === id);

  const { width } = useWindowDimensions();
  const photoSize = Math.min(width * 0.35, 160);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={typography.body}>Pet not found</Text>
      </View>
    );
  }

  const petActivities = [...activities]
    .filter((a) => a.petId === pet.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = () => {
    Alert.alert(
      "Delete pet?",
      `This will also delete all logged activities for ${pet.name}. This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePet(pet.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {pet.photoUri ? (
          <Image
            source={{ uri: pet.photoUri }}
            style={[styles.photo, { width: photoSize, height: photoSize }]}
          />
        ) : (
          <View style={[styles.photo, styles.placeholder]}>
            <Text style={styles.placeholderText}>🐾</Text>
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={typography.display}>{pet.name}</Text>
          <Text style={[typography.body, { color: colors.textMuted }]}>
            {pet.breed}
          </Text>
          <View style={styles.metaRow}>
            {pet.age !== undefined && (
              <Text style={typography.body}>{pet.age} years old</Text>
            )}
            {pet.gender && pet.gender !== "unknown" && (
              <Text style={typography.caption}>
                {pet.gender === "male" ? "♂" : "♀"}
              </Text>
            )}
          </View>
        </View>
      </View>

      {pet.notes && (
        <View style={styles.notesBox}>
          <Text style={typography.label}>NOTES</Text>
          <Text style={typography.body}>{pet.notes}</Text>
        </View>
      )}

      <View style={styles.statBox}>
        <Text style={typography.title}>{petActivities.length}</Text>
        <Text style={typography.caption}>
          {petActivities.length === 1 ? "activity logged" : "activities logged"}
        </Text>
      </View>

      <Text style={typography.heading}>History</Text>
      {petActivities.length === 0 ? (
        <Text style={[typography.body, { color: colors.textMuted }]}>
          No activities logged for {pet.name} yet.
        </Text>
      ) : (
        <View style={{ gap: spacing.sm, alignSelf: "stretch" }}>
          {petActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              petName={pet.name}
              onDelete={() => deleteActivity(activity.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.editButton}
          onPress={() =>
            router.push({ pathname: "/edit-pet", params: { id: pet.id } })
          }
        >
          <Text
            style={[typography.bodyMedium, { color: colors.textOnPrimary }]}
          >
            Edit pet
          </Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={[typography.bodyMedium, { color: colors.white }]}>
            Delete pet
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  header: { flexDirection: "row", gap: spacing.lg, alignItems: "flex-start" },
  headerInfo: { flex: 1, gap: spacing.xs, justifyContent: "center" },
  photo: { borderRadius: radius.lg },
  placeholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { fontSize: 56 },
  metaRow: { flexDirection: "row", gap: spacing.md },
  notesBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    alignSelf: "stretch",
    gap: spacing.xs,
  },
  statBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 160,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignSelf: "stretch",
    marginTop: spacing.lg,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
});
