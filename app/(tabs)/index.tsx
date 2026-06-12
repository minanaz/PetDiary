import { usePets } from "@/context/PetContext";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing, typography } from "../../constants/theme";

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
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

        <Text
          style={typography.body}
          onPress={() =>
            router.push({ pathname: "/pet/[id]", params: { id: "test123" } })
          }
        >
          Go to pet detail (stack)
        </Text>
        <Text
          style={typography.body}
          onPress={() => router.push({ pathname: "/add-entry" })}
        >
          Open add entry (modal)
        </Text>
      </ScrollView>
    </SafeAreaView>
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
