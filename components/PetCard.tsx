import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "../constants/theme";
import type { Pet } from "../types/pet";

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      {pet.photoUri ? (
        <Image source={{ uri: pet.photoUri }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.placeholder]}>
          <Ionicons name="paw-outline" size={32} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={typography.heading}>{pet.name}</Text>
        <Text style={typography.caption}>{pet.breed}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: { opacity: 0.8 },
  photo: { width: 56, height: 56, borderRadius: radius.md },
  placeholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { fontSize: 28 },
  info: { flex: 1, gap: spacing.xs },
});
