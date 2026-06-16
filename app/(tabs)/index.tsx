import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityCard } from "../../components/ActivityCard";
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "../../constants/theme";
import { usePets } from "../../context/PetContext";
import { getGreeting } from "../../utils/greeting";
import { fetchWeather, type WeatherData } from "../../utils/weather";

export default function TodayScreen() {
  const { pets, activities, deleteActivity, isLoading } = usePets();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setWeatherError("Location permission denied: cannot show weather.");
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        const data = await fetchWeather(
          position.coords.latitude,
          position.coords.longitude,
        );
        setWeather(data);
      } catch (err) {
        setWeatherError("Could not load weather. Check your connection!");
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (isLoading) {
    return <Text style={typography.body}>Loading...</Text>;
  }

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) //newest first
    .slice(0, 3);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PetDiary</Text>
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.greetingRow}>
          <Text style={typography.display}>{getGreeting()}!</Text>
          <Ionicons name="paw" size={28} color={colors.accent} />
        </View>

        {weatherLoading && (
          <ActivityIndicator size="large" color={colors.primary} />
        )}

        {!weatherLoading && weatherError && (
          <Text style={[typography.body, { color: colors.danger }]}>
            {weatherError}
          </Text>
        )}

        {!weatherLoading && weather && (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
              }}
              style={styles.icon}
            />
            <Text style={[typography.title, { color: colors.textOnPrimary }]}>
              {weather.temperature}°C
            </Text>
            <Text style={[typography.body, { color: colors.textOnPrimary }]}>
              {weather.description}
            </Text>
            <Text style={[typography.caption, { color: colors.textOnPrimary }]}>
              {weather.temperature > 15
                ? "Good weather for a walk! 🐾"
                : "A bit chilly! Maybe a shorter walk today :) 🧣"}
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.navy }]}>
            <Text style={[typography.title, { color: colors.textOnPrimary }]}>
              {pets.length}
            </Text>
            <Text style={[typography.caption, { color: colors.border }]}>
              {pets.length === 1 ? "pet" : "pets"}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.accent }]}>
            <Text style={[typography.title, { color: colors.textOnAccent }]}>
              {activities.length}
            </Text>
            <Text style={[typography.caption, { color: colors.textOnAccent }]}>
              {activities.length === 1
                ? "activity logged"
                : "activities logged"}
            </Text>
          </View>
        </View>

        <Text style={typography.heading}>Recent activity</Text>
        {recentActivities.length === 0 ? (
          <Text style={[typography.body, { color: colors.textMuted }]}>
            Nothing logged yet. Add your first entry on the Log tab!
          </Text>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {recentActivities.map((activity) => {
              const pet = pets.find((p) => p.id === activity.petId);
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  petName={pet?.name ?? "Unknown pet"}
                  onDelete={() => deleteActivity(activity.id)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },
  headerSafe: { backgroundColor: colors.primary },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  headerTitle: {
    fontFamily: typography.title.fontFamily,
    fontSize: 26,
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  content: { padding: spacing.xl, gap: spacing.lg },
  greetingRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    ...shadow,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: { width: 80, height: 80 },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statBox: {
    flex: 1,
    // backgroundColor: colors.accent,
    borderRadius: radius.lg,
    ...shadow,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
});
