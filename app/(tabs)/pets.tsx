import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PetCard } from "../../components/PetCard";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { usePets } from "../../context/PetContext";
import type { Pet } from "../../types/pet";

export default function PetsScreen() {
  const { pets, addPet, isLoading } = usePets();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");

  if (isLoading) {
    return <Text style={typography.body}>Loading...</Text>;
  }

  const handleAddPet = () => {
    if (name.trim() === "" || breed.trim() === "") return;

    const newPet: Pet = {
      id: Date.now().toString(),
      name: name.trim(),
      breed: breed.trim(),
      createdAt: new Date().toISOString(),
    };
    addPet(newPet);
    setName("");
    setBreed("");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={typography.title}>Your pets</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Breed"
                placeholderTextColor={colors.textMuted}
                value={breed}
                onChangeText={setBreed}
              />
              <Pressable style={styles.addButton} onPress={handleAddPet}>
                <Text
                  style={[
                    typography.bodyMedium,
                    { color: colors.textOnAccent },
                  ]}
                >
                  Add pet
                </Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={[typography.body, { color: colors.textMuted }]}>
            No pets yet! Add your first one above.
          </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.sm },
  header: { gap: spacing.md, marginBottom: spacing.md },
  form: { gap: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
});
