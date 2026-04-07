type detailsProps = {
    humidity: number;
    wind: number;
    pressure: number;
    airPollution: number;
};

export function WeatherDetails({ humidity, wind, pressure, airPollution }: detailsProps) {
    return (
        <div className="details">
            <div className="detail-item">
                <span>Влажность</span>
                <strong>{humidity}%</strong>
            </div>
            <div className="detail-item">
                <span>Ветер</span>
                <strong>{wind} м/с</strong>
            </div>
            <div className="detail-item">
                <span>Давление</span>
                <strong>{pressure} мм</strong>
            </div>
            <div className="detail-item">
                <span>Загрязнение</span>
                <strong>Ур. {airPollution}</strong>
            </div>
        </div>
    );
}
