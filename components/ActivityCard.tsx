import { Pressable, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { colors, radius, spacing, typography } from "../constants/theme";
import { ACTIVITY_LABELS, type Activity } from "../types/activity";

interface ActivityCardProps {
  activity: Activity;
  petName: string;
  onDelete: () => void;
}

export function ActivityCard({
  activity,
  petName,
  onDelete,
}: ActivityCardProps) {
  const date = new Date(activity.date);
  const formattedDate =
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <View style={styles.card}>
      {activity.photoUri && (
        <Image source={{ uri: activity.photoUri }} style={styles.thumbnail} />
      )}
      <View style={styles.info}>
        <Text style={typography.heading}>{ACTIVITY_LABELS[activity.type]}</Text>
        <Text style={typography.caption}>
          {petName} · {formattedDate}
        </Text>
        {activity.note ? (
          <Text style={typography.body}>{activity.note}</Text>
        ) : null}
      </View>
      <Pressable
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[typography.bodyMedium, { color: colors.danger }]}>
          Delete
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  info: { flex: 1, gap: spacing.xs },
  deleteButton: { padding: spacing.sm },
  pressed: { opacity: 0.6 },
  thumbnail: { width: 48, height: 48, borderRadius: radius.sm },
});
