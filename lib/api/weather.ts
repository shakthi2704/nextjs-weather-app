import type {
  WeatherData, CurrentWeather, HourlyForecast,
  DailyForecast, AirQuality, Location, SearchResult
} from "@/types";

// ─────────────────────────────────────────────
//  Weather API Service
//  Open-Meteo (forecast+AQI) + WeatherAPI (search) + OpenWeather (alerts)
// ─────────────────────────────────────────────

const WEATHERAPI_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

// ── Wind direction helper ─────────────────────
function degToDir(deg: number): string {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// ── AQI level helper ──────────────────────────
function getAQILevel(aqi: number) {
  if (aqi <= 50)  return { level: "Good",                    color: "#22c55e" };
  if (aqi <= 100) return { level: "Moderate",                color: "#eab308" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive", color: "#f97316" };
  if (aqi <= 200) return { level: "Unhealthy",               color: "#ef4444" };
  if (aqi <= 300) return { level: "Very Unhealthy",          color: "#a855f7" };
  return           { level: "Hazardous",                     color: "#7f1d1d" };
}

// ─────────────────────────────────────────────
//  1. CITY SEARCH — WeatherAPI
// ─────────────────────────────────────────────
export async function searchCities(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(query)}`
  );
  if (!res.ok) return [];

  const data = await res.json();
  return data.map((item: any) => ({
    id:          String(item.id),
    name:        item.name,
    country:     item.country,
    countryCode: item.country,
    lat:         item.lat,
    lon:         item.lon,
    region:      item.region,
  }));
}

// ─────────────────────────────────────────────
//  2. IP GEOLOCATION — ip-api.com (free, no key)
// ─────────────────────────────────────────────
export async function getLocationByIP(): Promise<Partial<Location> | null> {
  try {
    const res = await fetch("http://ip-api.com/json?fields=status,city,country,countryCode,lat,lon,timezone,regionName");
    const data = await res.json();
    if (data.status !== "success") return null;
    return {
      city:        data.city,
      country:     data.country,
      countryCode: data.countryCode,
      lat:         data.lat,
      lon:         data.lon,
      timezone:    data.timezone,
      region:      data.regionName,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
//  3. REVERSE GEOCODE — WeatherAPI
// ─────────────────────────────────────────────
export async function reverseGeocode(lat: number, lon: number): Promise<Partial<Location> | null> {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&aqi=no`
    );
    const data = await res.json();
    return {
      city:        data.location.name,
      country:     data.location.country,
      lat:         data.location.lat,
      lon:         data.location.lon,
      timezone:    data.location.tz_id,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
//  4. FULL WEATHER — Open-Meteo (main data source)
// ─────────────────────────────────────────────
export async function getWeatherData(lat: number, lon: number, location: Partial<Location>): Promise<WeatherData> {

  // Build Open-Meteo URL
  const params = new URLSearchParams({
    latitude:              String(lat),
    longitude:             String(lon),
    current:               [
      "temperature_2m","relative_humidity_2m","apparent_temperature",
      "is_day","precipitation","weather_code","cloud_cover",
      "pressure_msl","surface_pressure","wind_speed_10m","wind_direction_10m",
      "wind_gusts_10m","visibility","uv_index","dew_point_2m"
    ].join(","),
    hourly:                [
      "temperature_2m","relative_humidity_2m","apparent_temperature",
      "precipitation_probability","precipitation","weather_code",
      "wind_speed_10m","uv_index","is_day"
    ].join(","),
    daily:                 [
      "weather_code","temperature_2m_max","temperature_2m_min",
      "precipitation_sum","precipitation_probability_max",
      "wind_speed_10m_max","uv_index_max","sunrise","sunset"
    ].join(","),
    timezone:      location.timezone || "auto",
    forecast_days: "7",
  });

  // AQI params
  const aqiParams = new URLSearchParams({
    latitude:     String(lat),
    longitude:    String(lon),
    current:      "european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
    hourly:       "european_aqi",
    forecast_days: "7",
    timezone:     location.timezone || "auto",
  });

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`),
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${aqiParams}`),
  ]);

  const [weatherJson, aqiJson] = await Promise.all([
    weatherRes.json(),
    aqiRes.json(),
  ]);

  // Open-Meteo returns { reason, error: true } on bad requests
  if (weatherJson.error) {
    throw new Error(weatherJson.reason ?? "Open-Meteo weather error")
  }

  const c = weatherJson.current;
  const daily = weatherJson.daily;
  const hourly = weatherJson.hourly;

  if (!c || !daily || !hourly) {
    throw new Error("Incomplete weather data from Open-Meteo")
  }

  // ── Current Weather ────────────────────────
  const current: CurrentWeather = {
    temp:          Math.round(c.temperature_2m),
    feelsLike:     Math.round(c.apparent_temperature),
    tempMin:       Math.round(daily.temperature_2m_min[0]),
    tempMax:       Math.round(daily.temperature_2m_max[0]),
    humidity:      c.relative_humidity_2m,
    windSpeed:     Math.round(c.wind_speed_10m),
    windDeg:       c.wind_direction_10m,
    windDir:       degToDir(c.wind_direction_10m),
    windGust:      Math.round(c.wind_gusts_10m),
    visibility:    Math.round((c.visibility || 10000) / 1000),
    pressure:      Math.round(c.pressure_msl),
    uvIndex:       c.uv_index,
    cloudCover:    c.cloud_cover,
    dewPoint:      Math.round(c.dew_point_2m),
    conditionCode: c.weather_code,
    conditionText: getConditionText(c.weather_code),
    conditionIcon: getConditionIcon(c.weather_code, c.is_day),
    isDay:         c.is_day === 1,
    sunrise:       daily.sunrise[0],
    sunset:        daily.sunset[0],
    lastUpdated:   c.time,
  };

  // ── Hourly ─────────────────────────────────
  const hourlyForecast: HourlyForecast[] = hourly.time.slice(0, 24).map((time: string, i: number) => ({
    time,
    temp:          Math.round(hourly.temperature_2m[i]),
    feelsLike:     Math.round(hourly.apparent_temperature[i]),
    humidity:      hourly.relative_humidity_2m[i],
    windSpeed:     Math.round(hourly.wind_speed_10m[i]),
    precipProb:    hourly.precipitation_probability[i] || 0,
    precipMm:      hourly.precipitation[i] || 0,
    conditionText: getConditionText(hourly.weather_code[i]),
    conditionIcon: getConditionIcon(hourly.weather_code[i], hourly.is_day[i]),
    isDay:         hourly.is_day[i] === 1,
    uvIndex:       hourly.uv_index[i] || 0,
  }));

  // ── Daily ──────────────────────────────────
  const dailyForecast: DailyForecast[] = daily.time.map((date: string, i: number) => ({
    date,
    dayName:       i === 0 ? "Today" : new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    tempMax:       Math.round(daily.temperature_2m_max[i]),
    tempMin:       Math.round(daily.temperature_2m_min[i]),
    humidity:      50, // open-meteo daily doesn't provide humidity directly
    windSpeed:     Math.round(daily.wind_speed_10m_max[i]),
    precipProb:    daily.precipitation_probability_max[i] || 0,
    precipMm:      daily.precipitation_sum[i] || 0,
    conditionText: getConditionText(daily.weather_code[i]),
    conditionIcon: getConditionIcon(daily.weather_code[i], 1),
    sunrise:       daily.sunrise[i],
    sunset:        daily.sunset[i],
    uvIndex:       daily.uv_index_max[i] || 0,
  }));

  // ── Air Quality ────────────────────────────
  const aqiC = aqiJson.current;
  const aqiScore = Math.round(aqiC?.european_aqi || 0);
  const { level, color } = getAQILevel(aqiScore);

  // Build 7-day daily AQI forecast from hourly data (take midday value per day)
  const aqiHourlyTimes: string[] = aqiJson.hourly?.time         ?? [];
  const aqiHourlyVals:  number[] = aqiJson.hourly?.european_aqi ?? [];

  const aqiForecastMap: Record<string, number[]> = {};
  aqiHourlyTimes.forEach((t: string, i: number) => {
    const day = t.split("T")[0];
    if (!aqiForecastMap[day]) aqiForecastMap[day] = [];
    if (aqiHourlyVals[i] != null) aqiForecastMap[day].push(aqiHourlyVals[i]);
  });

  const aqiDailyForecast = Object.entries(aqiForecastMap).slice(0, 7).map(([date, vals]) => {
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const { level: l, color: c } = getAQILevel(avg);
    return { date, aqi: avg, level: l, color: c };
  });

  // Hourly AQI for chart (next 24h)
  const nowIdx   = aqiHourlyTimes.findIndex((t: string) => new Date(t) >= new Date());
  const startIdx = nowIdx >= 0 ? nowIdx : 0;
  const aqiHourlyChart = aqiHourlyTimes.slice(startIdx, startIdx + 24).map((t: string, i: number) => ({
    time: new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    aqi:  Math.round(aqiHourlyVals[startIdx + i] ?? 0),
  }));

  const airQuality: AirQuality = {
    aqi:      aqiScore,
    aqiLevel: level as any,
    aqiText:  level,
    pm25:     Math.round(aqiC?.pm2_5 || 0),
    pm10:     Math.round(aqiC?.pm10 || 0),
    co:       Math.round((aqiC?.carbon_monoxide || 0) * 10) / 10,
    no2:      Math.round(aqiC?.nitrogen_dioxide || 0),
    so2:      Math.round(aqiC?.sulphur_dioxide || 0),
    o3:       Math.round(aqiC?.ozone || 0),
    color,
    forecast: aqiDailyForecast,
    hourly:   aqiHourlyChart,
  };

  // ── Alerts — OpenWeather ───────────────────
  let alerts = [];
  try {
    const alertRes = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${OPENWEATHER_KEY}`
    );
    const alertJson = await alertRes.json();
    alerts = (alertJson.alerts || []).map((a: any) => ({
      id:          a.event,
      event:       a.event,
      description: a.description,
      severity:    "Moderate",
      start:       new Date(a.start * 1000).toISOString(),
      end:         new Date(a.end   * 1000).toISOString(),
      senderName:  a.sender_name,
    }));
  } catch {
    // Alerts are optional — fail silently
  }

  return {
    location: {
      city:        location.city    || "Unknown",
      country:     location.country || "Unknown",
      countryCode: location.countryCode || "",
      lat,
      lon,
      timezone:    location.timezone || "UTC",
    },
    current,
    hourly: hourlyForecast,
    daily:  dailyForecast,
    airQuality,
    alerts,
  };
}

// ─────────────────────────────────────────────
//  WMO Weather Code → Text & Icon
// ─────────────────────────────────────────────
function getConditionText(code: number): string {
  const map: Record<number, string> = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy Fog",
    51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
    61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow", 77: "Snow Grains",
    80: "Slight Showers", 81: "Moderate Showers", 82: "Violent Showers",
    85: "Snow Showers", 86: "Heavy Snow Showers",
    95: "Thunderstorm", 96: "Thunderstorm w/ Hail", 99: "Thunderstorm w/ Heavy Hail",
  };
  return map[code] || "Unknown";
}

function getConditionIcon(code: number, isDay: number): string {
  if (code === 0)              return isDay ? "☀️" : "🌙";
  if (code <= 2)               return isDay ? "🌤️" : "🌙";
  if (code === 3)              return "☁️";
  if (code <= 48)              return "🌫️";
  if (code <= 55)              return "🌦️";
  if (code <= 65)              return "🌧️";
  if (code <= 77)              return "❄️";
  if (code <= 82)              return "🌧️";
  if (code <= 86)              return "🌨️";
  return "⛈️";
}