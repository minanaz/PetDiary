export type ActivityType = "meal" | "walk" | "med" | "vet" | "play";

export interface Activity {
  id: string;
  petId: string;
  type: ActivityType;
  note?: string;
  photoUri?: string;
  date: string;
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  meal: "Meal",
  walk: "Walk",
  med: "Medication",
  vet: "Vet visit",
  play: "Play",
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  meal: "restaurant-outline",
  walk: "walk-outline",
  med: "medkit-outline",
  vet: "medical-outline",
  play: "tennisball-outline",
};
