import { useState, useEffect } from "react";
import { CITIES } from "./mockData";
import { fetchWeatherData } from "./api";

import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { WeatherDetails } from "./components/WeatherDetails";
import { DailyForecast } from "./components/DailyForecast";

// Типы для стейта шоб TS не ругался
type WeatherState = {
    current: { temp: number; description: string; icon: string; humidity: number; wind: number; pressure: number; airPollution: number };
    hourly: { time: string; temp: number; icon: string }[];
    daily: { day: string; tempDay: number; tempNight: number; icon: string }[];
} | null;

export function App() {
    const [city, setCity] = useState<string>(CITIES[0]);
    const [weather, setWeather] = useState<WeatherState>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function loadWeather() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWeatherData(city);
                if (mounted) setWeather(data);
            } catch (err: any) {
                if (mounted) setError(err.message || "Ошибка загрузки");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadWeather();

        // обновление каждые 3 часа
        const interval = setInterval(() => {
            loadWeather();
        }, 3 * 60 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [city]);

    const getIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

    if (loading) return <div className="app-container theme-day" style={{color: 'black'}}><div className="weather-card">Загрузка...</div></div>;

    // если апишка выдает ошибку (чаще всего 401 пока ключ не активируется)
    if (error || !weather) return (
        <div className="app-container theme-day">
            <div className="weather-card">
                <div className="header">
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="city-select">
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                    <p>Ошибка API:</p>
                    <p style={{color: '#ffcccc'}}>{error}</p>
                    <p style={{fontSize: '12px', marginTop: '10px'}}>мб ключ еще не активен</p>
                </div>
            </div>
        </div>
    );

    const isNightNow = weather.current.icon.endsWith("n");
    const themeClass = isNightNow ? "theme-night" : "theme-day";

    return (
        <div className={`app-container ${themeClass}`}>
            <div className="weather-card">

                <div className="header">
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="city-select">
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <CurrentWeather
                    temp={weather.current.temp}
                    description={weather.current.description}
                    iconUrl={getIconUrl(weather.current.icon)}
                />

                <HourlyForecast
                    hourly={weather.hourly}
                    getIconUrl={getIconUrl}
                />

                <WeatherDetails
                    humidity={weather.current.humidity}
                    wind={weather.current.wind}
                    pressure={weather.current.pressure}
                    airPollution={weather.current.airPollution}
                />

                <DailyForecast
                    daily={weather.daily}
                    getIconUrl={getIconUrl}
                />

            </div>
        </div>
    );
}
