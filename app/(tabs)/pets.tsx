import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedButton } from "@/components/AnimatedButton";
import { PetCard } from "../../components/PetCard";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { usePets } from "../../context/PetContext";

export default function PetsScreen() {
  const { pets, isLoading } = usePets();

  if (isLoading) {
    return <Text style={typography.body}>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={typography.title}>Your pets</Text>}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[typography.body, { color: colors.textMuted }]}>
              No pets yet.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push("/add-pet")}
            >
              <Text
                style={[typography.bodyMedium, { color: colors.textOnAccent }]}
              >
                🐾 Add your first pet
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() =>
              router.push({ pathname: "/pet/[id]", params: { id: item.id } })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />

      {pets.length > 0 && (
        <AnimatedButton
          style={styles.fab}
          onPress={() => router.push("/add-pet")}
        >
          <Text style={styles.fabText}>+</Text>
        </AnimatedButton>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.sm, flexGrow: 1 },
  emptyState: {
    alignItems: "center",
    gap: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
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
