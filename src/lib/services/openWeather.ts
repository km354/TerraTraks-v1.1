/**
 * OpenWeather API Service
 * 
 * TODO: Implement real OpenWeather API integration
 * API Documentation: https://openweathermap.org/api
 */

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  current?: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    clouds: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily?: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
      day: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    precipitation?: number;
    wind_speed: number;
  }>;
}

/**
 * Get weather for specific coordinates
 * @param lat - Latitude
 * @param lng - Longitude
 * @param date - Optional date (for future forecasts)
 */
export async function getWeatherForCoordinates(
  lat: number,
  lng: number,
  date?: Date
): Promise<WeatherData> {
  // TODO: Implement real OpenWeather API call
  // const apiKey = process.env.OPENWEATHER_API_KEY;
  // if (!apiKey) {
  //   throw new Error("OPENWEATHER_API_KEY is not set");
  // }
  //
  // const endpoint = date
  //   ? "https://api.openweathermap.org/data/3.0/onecall/day_summary"
  //   : "https://api.openweathermap.org/data/3.0/onecall";
  //
  // const params = new URLSearchParams({
  //   lat: lat.toString(),
  //   lon: lng.toString(),
  //   appid: apiKey,
  //   units: "imperial",
  //   exclude: "minutely,hourly",
  // });
  //
  // if (date) {
  //   params.append("date", date.toISOString().split("T")[0]);
  // }
  //
  // const response = await fetch(`${endpoint}?${params}`);
  // const data = await response.json();
  // return data;

  // Mock data for development
  return {
    lat,
    lon: lng,
    timezone: "America/Denver",
    current: {
      dt: Math.floor(Date.now() / 1000),
      temp: 65,
      feels_like: 63,
      humidity: 45,
      clouds: 20,
      wind_speed: 8,
      weather: [
        {
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
    },
    daily: [
      {
        dt: Math.floor(Date.now() / 1000),
        temp: {
          min: 55,
          max: 75,
          day: 65,
        },
        weather: [
          {
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        precipitation: 0,
        wind_speed: 8,
      },
    ],
  };
}

/**
 * Get weather forecast for multiple days
 * @param lat - Latitude
 * @param lng - Longitude
 * @param days - Number of days to forecast (1-16)
 */
export async function getWeatherForecast(
  lat: number,
  lng: number,
  days: number = 7
): Promise<WeatherData> {
  // TODO: Implement real OpenWeather forecast API call
  // Similar to getWeatherForCoordinates but with daily forecast

  // Mock data for development
  const daily = Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 86400,
    temp: {
      min: 50 + Math.random() * 10,
      max: 70 + Math.random() * 10,
      day: 60 + Math.random() * 10,
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    precipitation: Math.random() * 0.5,
    wind_speed: 5 + Math.random() * 5,
  }));

  return {
    lat,
    lon: lng,
    timezone: "America/Denver",
    daily,
  };
}

