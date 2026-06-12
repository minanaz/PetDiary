import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityCard } from "../../components/ActivityCard";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { usePets } from "../../context/PetContext";

export default function LogScreen() {
  const { pets, activities, deleteActivity, isLoading } = usePets();

  if (isLoading) {
    return <Text style={typography.body}>Loading...</Text>;
  }

  // sort by date descending, newest first
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={sortedActivities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={typography.title}>Activity log</Text>}
        ListEmptyComponent={
          <Text style={[typography.body, { color: colors.textMuted }]}>
            No entries yet! Tap the + button to add one
          </Text>
        }
        renderItem={({ item }) => {
          const pet = pets.find((p) => p.id === item.petId);
          return (
            <ActivityCard
              activity={item}
              petName={pet?.name ?? "Unknown pet"}
              onDelete={() => deleteActivity(item.id)}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
      <Pressable style={styles.fab} onPress={() => router.push("/add-entry")}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    fontSize: 28,
    color: colors.textOnAccent,
    fontFamily: typography.heading.fontFamily,
  },
});
