import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing, typography } from "../../constants/theme";
import { fetchWeather, type WeatherData } from "../../utils/weather";

export default function TodayScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied: cannot show weather.");
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        const data = await fetchWeather(
          position.coords.latitude,
          position.coords.longitude,
        );
        setWeather(data);
      } catch (err) {
        setError("Could not load weather. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.content}>
        <Text style={typography.display}>Today</Text>

        {loading && <ActivityIndicator size="large" color={colors.primary} />}

        {!loading && error && (
          <Text style={[typography.body, { color: colors.danger }]}>
            {error}
          </Text>
        )}

        {!loading && weather && (
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
                : "A bit chilly, maybe a shorter walk today :)"}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xl, gap: spacing.lg },
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
});
