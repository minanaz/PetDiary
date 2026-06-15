import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radius, spacing, typography } from "@/constants/theme";
import { usePets } from "@/context/PetContext";
import { PetGender } from "@/types/pet";
import { saveImageToDevice } from "@/utils/saveImage";

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, updatePet } = usePets();
  const pet = pets.find((p) => p.id === id);

  const [name, setName] = useState(pet?.name ?? "");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [age, setAge] = useState(pet?.age?.toString() ?? "");
  const [gender, setGender] = useState<PetGender>(pet?.gender ?? "unknown");
  const [notes, setNotes] = useState(pet?.notes ?? "");
  const [photoUri, setPhotoUri] = useState<string | undefined>(pet?.photoUri);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={typography.body}>Pet not found.</Text>
      </View>
    );
  }

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) return;

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });

    if (result.canceled) return;

    const tempUri = result.assets[0].uri;
    const permanentUri = await saveImageToDevice(tempUri);
    setPhotoUri(permanentUri);
  };

  const handleSave = () => {
    if (name.trim() === "" || breed.trim() === "") return;

    const parsedAge = parseInt(age, 10);

    updatePet({
      id: pet.id,
      name: name.trim(),
      breed: breed.trim(),
      age: Number.isNaN(parsedAge) ? undefined : parsedAge,
      gender,
      notes: notes.trim() === "" ? undefined : notes.trim(),
      photoUri,
      createdAt: pet.createdAt,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={typography.title}>Edit a pet</Text>

      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.formPhoto} />
          <Pressable
            onPress={() => setPhotoUri(undefined)}
            style={styles.removePhotoButton}
          >
            <Text style={[typography.bodyMedium, { color: colors.danger }]}>
              Remove photo
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.row}>
          <Pressable style={styles.photoButton} onPress={() => pickImage(true)}>
            <Text style={styles.chipText}>Take photo</Text>
          </Pressable>
          <Pressable
            style={styles.photoButton}
            onPress={() => pickImage(false)}
          >
            <Text style={styles.chipText}>Choose from gallery</Text>
          </Pressable>
        </View>
      )}

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
      <TextInput
        style={styles.input}
        placeholder="Age (years)"
        placeholderTextColor={colors.textMuted}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        {(["male", "female", "unknown"] as PetGender[]).map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g)}
            style={[styles.chip, gender === g && styles.chipSelected]}
          >
            <Text
              style={gender === g ? styles.chipTextSelected : styles.chipText}
            >
              {g === "male"
                ? "♂ Male"
                : g === "female"
                  ? "♀ Female"
                  : "? Unknown"}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Optionally: Notes (allergies, etc.)"
        placeholderTextColor={colors.textMuted}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

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
  notesInput: { minHeight: 60, textAlignVertical: "top" },
  chip: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: "center",
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
  formPhoto: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    alignSelf: "center",
  },
  removePhotoButton: { alignSelf: "center", padding: spacing.sm },
  photoButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
});
