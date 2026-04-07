// моковые данные для лабы
export const CITIES = [
    "Москва",
    "Санкт-Петербург",
    "Ростов-на-Дону",
    "Батайск",
    "Краснодар",
    "Самара"
] as const;


export function getMockWeather(cityName: string) {
    // делаем небольшую разницу в данных между городами на основе их длины
    const seed = cityName.length;
    const isNight = new Date().getHours() < 6 || new Date().getHours() > 20;

    // иконки из openweather: 01 - ясно, 02 - малооблачно, 10 - дождь
    const mainIcon = isNight ? "01n" : (seed % 2 === 0 ? "01d" : "10d");

    return {
        current: {
            temp: 15 + seed,
            description: seed % 2 === 0 ? "ясно" : "дождь",
            icon: mainIcon,
            humidity: 50 + seed * 2,
            wind: 2 + (seed % 3),
            pressure: 750 + seed,
            uv: seed % 6,
            airPollution: (seed % 3) + 1, // 1 (хорошо) до 3 (плохо)
            isNight,
        },
        hourly: [
            { time: "Сейчас", temp: 15 + seed, icon: mainIcon },
            { time: "Через 3ч", temp: 16 + seed, icon: "02d" },
            { time: "Через 6ч", temp: 14 + seed, icon: "10d" },
            { time: "Через 9ч", temp: 10 + seed, icon: "01n" }
        ],
        daily: [
            { day: "Завтра", tempDay: 18 + seed, tempNight: 10 + seed, icon: "01d" },
            { day: "Послезавтра", tempDay: 19 + seed, tempNight: 11 + seed, icon: "02d" },
            { day: "Через 3 дн", tempDay: 15 + seed, tempNight: 8 + seed, icon: "10d" },
            { day: "Через 4 дн", tempDay: 20 + seed, tempNight: 12 + seed, icon: "01d" },
            { day: "Через 5 дн", tempDay: 22 + seed, tempNight: 14 + seed, icon: "01d" }
        ]
    };
}
