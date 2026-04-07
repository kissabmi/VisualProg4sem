type currentProps = {
    temp: number;
    description: string;
    iconUrl: string;
};

export function CurrentWeather({ temp, description, iconUrl }: currentProps) {
    return (
        <div className="current-weather">
            <div className="temp-info">
                <h2>+{temp}°</h2>
                <span className="desc">{description}</span>
            </div>
            <img src={iconUrl} alt="weather_icon" className="big-icon" />
        </div>
    );
}
