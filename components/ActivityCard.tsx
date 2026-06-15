import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, radius, spacing, typography } from "../constants/theme";
import { ACTIVITY_LABELS, type Activity } from "../types/activity";

interface ActivityCardProps {
  activity: Activity;
  petName: string;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = -80; // threshold in px to trigger delete when swiping

export function ActivityCard({
  activity,
  petName,
  onDelete,
}: ActivityCardProps) {
  const translateX = useSharedValue(0);

  const date = new Date(activity.date);
  const formattedDate =
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const panGesture = Gesture.Pan()
    // onUpdate while dragging
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX); // allow only swiping left
    })
    // onEnd when the finger lifts
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-500, { duration: 200 }, () => {
          runOnJS(onDelete)(); // delete when swiped enough
        });
      } else {
        translateX.value = withTiming(0); // back to the start if not swiped enough
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteBackgroundStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0, // show delete background only when swiping
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.deleteBackground, deleteBackgroundStyle]}>
        <Text style={[typography.bodyMedium, { color: colors.white }]}>
          Delete
        </Text>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.card, animatedStyle]}
          entering={FadeInDown}
        >
          {activity.photoUri && (
            <Image
              source={{ uri: activity.photoUri }}
              style={styles.thumbnail}
            />
          )}
          <View style={styles.info}>
            <Text style={typography.heading}>
              {ACTIVITY_LABELS[activity.type]}
            </Text>
            <Text style={typography.caption}>
              {petName} · {formattedDate}
            </Text>
            {activity.note ? (
              <Text style={typography.body}>{activity.note}</Text>
            ) : null}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: radius.lg, overflow: "hidden" },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: spacing.lg,
  },
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
  thumbnail: { width: 48, height: 48, borderRadius: radius.sm },
  info: { flex: 1, gap: spacing.xs },
});
