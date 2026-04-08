import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { App } from "./App";
import * as api from "./api"; // импортируем апишку чтобы мокать

// мокаем модуль апи
vi.mock("./api");

describe("Weather App", () => {
    it("рендерит загрузку, а затем моковые данные", async () => {
        // подменяем реальный fetchWeatherData моком
        vi.mocked(api.fetchWeatherData).mockResolvedValue({
            current: { temp: 25, description: "ясно", icon: "01d", humidity: 60, wind: 3, pressure: 750, airPollution: 1 },
            hourly: [{ time: "16:00", temp: 26, icon: "01d" }],
            daily: [{ day: "Завтра", tempDay: 28, tempNight: 15, icon: "01d" }]
        });

        render(<App />);

        // проверяем что сначала лоадинг показывается
        expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument();

        // ждем когда отрендерится заголовок температуры из мока
        await waitFor(() => {
            expect(screen.getByText("+25°")).toBeInTheDocument();
        });

        // проверяем остальные данные
        expect(screen.getByText("ясно")).toBeInTheDocument();
        expect(screen.getByText(/60%/)).toBeInTheDocument();
    });

    it("отображает ошибку если апи отваливается", async () => {
        vi.mocked(api.fetchWeatherData).mockRejectedValue(new Error("Тестовая ошибка API"));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/Ошибка API:/i)).toBeInTheDocument();
            expect(screen.getByText("Тестовая ошибка API")).toBeInTheDocument();
        });
    });
});
