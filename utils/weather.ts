const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

// fetch current weather from openweathermap
export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
}
