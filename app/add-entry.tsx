import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing, typography } from "../constants/theme";
import { usePets } from "../context/PetContext";
import { ACTIVITY_LABELS, type ActivityType } from "../types/activity";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { AnimatedButton } from "@/components/AnimatedButton";
import * as Haptics from "expo-haptics";
import { saveImageToDevice } from "../utils/saveImage";

const ACTIVITY_TYPES: ActivityType[] = ["meal", "walk", "med", "vet", "play"];

export default function AddEntryScreen() {
  const { pets, addActivity } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    pets[0]?.id ?? null,
  );
  const [selectedType, setSelectedType] = useState<ActivityType>("meal");

  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const pickImage = async (useCamera: boolean) => {
    try {
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
    } catch (error) {
      console.error("Failed to pick photo", error);
      Alert.alert(
        "Photo error",
        "Something went wrong opening the camera or gallery.",
      );
    }
  };

  const handleSave = () => {
    if (!selectedPetId) {
      Alert.alert("No pet selected", "Please add a pet first or select one.");
      return;
    }

    addActivity({
      id: Date.now().toString(),
      petId: selectedPetId,
      type: selectedType,
      date: new Date().toISOString(),
      photoUri,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPetId(pet.id);
            }}
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
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedType(type);
            }}
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

      <Text style={typography.label}>PHOTO (OPTIONAL)</Text>
      {photoUri && (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <AnimatedButton
            onPress={() => setPhotoUri(undefined)}
            style={styles.removeButton}
          >
            <Text style={[typography.bodyMedium, { color: colors.danger }]}>
              Remove photo
            </Text>
          </AnimatedButton>
        </>
      )}
      <View style={styles.row}>
        <AnimatedButton
          style={styles.photoButton}
          onPress={() => pickImage(true)}
        >
          <Text style={styles.chipText}>Take photo</Text>
        </AnimatedButton>
        <AnimatedButton
          style={styles.photoButton}
          onPress={() => pickImage(false)}
        >
          <Text style={styles.chipText}>Choose from gallery</Text>
        </AnimatedButton>
      </View>

      <AnimatedButton style={styles.saveButton} onPress={handleSave}>
        <Text style={[typography.bodyMedium, { color: colors.textOnAccent }]}>
          Save
        </Text>
      </AnimatedButton>
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
  preview: {
    width: "100%",
    height: 180,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  photoButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  removeButton: { alignSelf: "flex-start", padding: spacing.sm },
});
