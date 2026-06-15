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
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityCard } from "../../components/ActivityCard";
import { colors, radius, spacing, typography } from "../../constants/theme";
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
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.display}>{getGreeting()}!</Text>

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
            <Text style={typography.title}>{weather.temperature}°C</Text>
            <Text style={[typography.body, { color: colors.textMuted }]}>
              {weather.description}
            </Text>
            <Text style={typography.caption}>
              {weather.temperature > 15
                ? "Good weather for a walk! 🐾"
                : "A bit chilly! Maybe a shorter walk today :) 🧣"}
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={typography.title}>{pets.length}</Text>
            <Text style={typography.caption}>
              {pets.length === 1 ? "pet" : "pets"}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={typography.title}>{activities.length}</Text>
            <Text style={typography.caption}>
              {activities.length === 1 ? "entry logged" : "entries logged"}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: { width: 80, height: 80 },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
});
