/// <reference types="vite/client" />
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchWeatherData(city: string) {
    if (!API_KEY) {
        throw new Error("Не задан API ключ");
    }

    // 1. Geocoding API: получаем координаты города
    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const geoData = await geoRes.json();
    
    if (geoData.cod && geoData.message) {
        throw new Error(geoData.message); 
    }
    
    if (!geoData || geoData.length === 0) {
        throw new Error("Город не найден");
    }

    const { lat, lon } = geoData[0];

    // 2. Forecast API & 3. Air Pollution API параллельно
    const [forecastRes, pollutionRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    ]);

    const forecastData = await forecastRes.json();
    const pollutionData = await pollutionRes.json();

    if (forecastData.cod !== "200") {
        throw new Error(forecastData.message || "Ошибка загрузки погоды");
    }

    // Парсим текущую погоду (берем первый элемент из прогноза как текущую)
    const currentItem = forecastData.list[0];
    
    // Парсим Air pollution (AQI: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor)
    const aqi = pollutionData.list?.[0]?.main?.aqi || 1;

    const current = {
        temp: Math.round(currentItem.main.temp),
        description: currentItem.weather[0].description,
        icon: currentItem.weather[0].icon,
        humidity: currentItem.main.humidity,
        wind: Math.round(currentItem.wind.speed),
        pressure: Math.round(currentItem.main.pressure * 0.75006), // перевод из hPa в мм.рт.ст.
        airPollution: aqi
    };

    // Парсим почасовой (берем следующие 4 шага по 3 часа)
    const hourly = forecastData.list.slice(0, 4).map((item: any) => ({
        time: item.dt_txt.split(" ")[1].slice(0, 5), // "12:00"
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon
    }));

    // Парсим на дни (берем по одному элементу на каждый из следующих 5 дней, желательно в 12:00)
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
        const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
        if (!dailyMap.has(date)) {
            dailyMap.set(date, []);
        }
        dailyMap.get(date).push(item);
    });

    const daily = Array.from(dailyMap.entries()).slice(1, 6).map(([date, items]: [string, any[]]) => {
        // Найдем дневную температуру (макс) и ночную (мин)
        const temps = items.map(i => i.main.temp);
        const icon = items[Math.floor(items.length / 2)].weather[0].icon.replace('n', 'd'); // дневная иконка по умолчанию

        // Получаем название дня недели
        const dayObj = new Date(date);
        const dayStr = dayObj.toLocaleDateString("ru-RU", { weekday: "long" });

        return {
            day: dayStr.charAt(0).toUpperCase() + dayStr.slice(1),
            tempDay: Math.round(Math.max(...temps)),
            tempNight: Math.round(Math.min(...temps)),
            icon: icon
        };
    });

    return { current, hourly, daily };
}
