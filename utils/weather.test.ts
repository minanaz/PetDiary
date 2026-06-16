describe("fetchWeather", () => {
  let fetchWeather: typeof import("./weather").fetchWeather;

  // set the API key before and reset the module cache before each test so fetchWeather gets the API key
  beforeEach(() => {
    process.env.EXPO_PUBLIC_WEATHER_API_KEY = "test-api-key";
    jest.resetModules();
    fetchWeather = require("./weather").fetchWeather;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("throws a clear error when the API request fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 401 }) as jest.Mock;
    await expect(fetchWeather(52.2, 21.0)).rejects.toThrow(
      "Weather request failed: 401",
    );
  });

  it("throws when the response has an unexpected shape", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as jest.Mock;
    await expect(fetchWeather(52.2, 21.0)).rejects.toThrow(
      "Unexpected weather data format",
    );
  });

  it("returns parsed weather data on a successful response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        main: { temp: 18.7 },
        weather: [{ description: "clear sky", icon: "01d" }],
      }),
    }) as jest.Mock;

    const result = await fetchWeather(52.2, 21.0);
    expect(result).toEqual({
      temperature: 19,
      description: "clear sky",
      icon: "01d",
    });
  });
});
