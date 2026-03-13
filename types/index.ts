// ─────────────────────────────────────────────
//  Global TypeScript Types — Weather App
// ─────────────────────────────────────────────

// ── Location ──────────────────────────────────
export interface Location {
  city: string
  country: string
  countryCode: string
  lat: number
  lon: number
  timezone: string
  region?: string
}

export interface SearchResult {
  id: string
  name: string
  country: string
  countryCode: string
  lat: number
  lon: number
  region?: string
}

// ── Current Weather ───────────────────────────
export interface CurrentWeather {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  windSpeed: number
  windDeg: number
  windDir: string
  windGust?: number
  visibility: number
  pressure: number
  uvIndex: number
  cloudCover: number
  dewPoint: number
  conditionCode: number
  conditionText: string
  conditionIcon: string
  isDay: boolean
  sunrise: string
  sunset: string
  lastUpdated: string
}

// ── Hourly Forecast ───────────────────────────
export interface HourlyForecast {
  time: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  precipProb: number
  precipMm: number
  conditionText: string
  conditionIcon: string
  isDay: boolean
  uvIndex: number
}

// ── Daily Forecast ────────────────────────────
export interface DailyForecast {
  date: string
  dayName: string
  tempMax: number
  tempMin: number
  humidity: number
  windSpeed: number
  precipProb: number
  precipMm: number
  conditionText: string
  conditionIcon: string
  sunrise: string
  sunset: string
  uvIndex: number
}

// ── Air Quality ───────────────────────────────
export interface AirQuality {
  aqi: number
  aqiLevel: AQILevel
  aqiText: string
  pm25: number
  pm10: number
  co: number
  no2: number
  so2: number
  o3: number
  color: string
  forecast: { date: string; aqi: number; level: string; color: string }[]
  hourly: { time: string; aqi: number }[]
}

export type AQILevel =
  | "Good"
  | "Moderate"
  | "Unhealthy for Sensitive"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous"

// ── Full Weather Data ─────────────────────────
export interface WeatherData {
  location: Location
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  airQuality: AirQuality
  alerts?: WeatherAlert[]
}

// ── Weather Alert ─────────────────────────────
export interface WeatherAlert {
  id: string
  event: string
  description: string
  severity: "Minor" | "Moderate" | "Severe" | "Extreme"
  start: string
  end: string
  senderName: string
}

// ── User / Auth ───────────────────────────────
export interface UserProfile {
  id: string
  name?: string
  email: string
  image?: string
  settings?: UserPreferences
}

export interface UserPreferences {
  tempUnit: "C" | "F"
  windUnit: "kmh" | "mph" | "ms"
  theme: "dark" | "light" | "system"
  language: string
  defaultCity?: string
  defaultLat?: number
  defaultLon?: number
  notifications: boolean
}

// ── Favorite City ─────────────────────────────
export interface FavoriteCity {
  id: string
  cityName: string
  country: string
  lat: number
  lon: number
  timezone?: string
  currentWeather?: Partial<CurrentWeather>
}

// ── API Responses ─────────────────────────────
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// ── Chart Data ────────────────────────────────
export interface ChartPoint {
  label: string
  value: number
  secondary?: number
}

// ── Weather Condition Codes ───────────────────
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "drizzle"
  | "thunderstorm"
  | "snow"
  | "fog"
  | "wind"
